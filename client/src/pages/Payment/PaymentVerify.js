"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "src/components/ui/button";
import { Checkbox } from "src/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";
import { useTournamentContext } from "src/hooks/useTournamentContext";
import { usePaymentContext } from "src/hooks/usePaymentContext";
import { useUserContext } from "src/hooks/useUserContext";
import { useAuthContext } from "src/hooks/useAuthContext";

const FormSchema = z.object({
  payments: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one item.",
  }),
  messages: z.string().optional(),
});

function PaymentVerify() {
  const { payments, dispatch } = usePaymentContext();
  const { tournaments, dispatch: dispatchTournament } = useTournamentContext();
  const { users } = useUserContext();
  const { user } = useAuthContext();

  const filteredTournaments = tournaments.filter(
    (tournament) =>
      tournament.meta.organizer_id === user._id &&
      tournament.meta.status === "published"
  );

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      payments: [],
      messages: "",
    },
  });

  const onSubmit = async (data, status) => {
    console.log(data);

    for (const d of data.payments) {
      try {
        const response = await fetch(`http://localhost:3002/api/payments/${d}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status, organizer_message: data.messages }),
        });

        const json = await response.json();

        if (response.ok) {
          dispatch({ type: "UPDATE_PAYMENT", payload: json.payment });
          if (status === "accepted") {
            dispatchTournament({ type: "UPDATE_TOURNAMENT", payload: json.tournament });
          }
        } else {
          console.error("Failed to update payment:", json.error);
        }
      } catch (error) {
        console.error("Error updating payment:", error);
      }
    }

    // window.location.reload();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data, "accepted"))} className="space-y-8">
        <FormField
          control={form.control}
          name="payments"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Payment Verification</FormLabel>
                <FormDescription>
                  Verify your participants' payments before they can join the tournament.
                </FormDescription>
              </div>
              {filteredTournaments.map((tournament) => (
                <div key={tournament._id}>
                  <h2 className="text-lg font-semibold mt-4">{tournament.name}</h2>
                  {payments
                    .filter(
                      (payment) =>
                        payment.tournamentid === tournament._id &&
                        payment.status === "pending"
                    )
                    .map((payment) => (
                      <FormField
                        key={payment._id}
                        control={form.control}
                        name="payments"
                        render={({ field }) => (
                          <FormItem
                            key={payment._id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(payment._id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, payment._id])
                                    : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== payment._id
                                      )
                                    );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Receipt ID: {payment.receiptid} - Payer Email: {users.find((user) => user._id === payment.payerid)?.email}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                </div>
              ))}
              <FormField
                control={form.control}
                name="messages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Organizer Message</FormLabel>
                    <textarea
                      {...field}
                      className="w-full border rounded p-2"
                      placeholder="Enter your message here..."
                    />
                  </FormItem>
                )}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Button type="submit" onClick={form.handleSubmit((data) => onSubmit(data, "accepted"))}>Accept</Button>
          <Button type="button" onClick={form.handleSubmit((data) => onSubmit(data, "rejected"))}>Reject</Button>
        </div>
      </form>
    </Form>
  );
}

export default PaymentVerify;
