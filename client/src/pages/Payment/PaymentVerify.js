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
  payments: z.array(z.string()).refine((value) => value.some((payment) => payment), {
    message: "You have to select at least one item.",
  }),
});

function PaymentVerify() {
  const { tournaments } = useTournamentContext();
  const { payments, dispatch } = usePaymentContext();
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
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
  
    // To iteratively update each item in the data array and ensure the updates happen sequentially,
    // we can use a for...of loop instead of map, because map with await will not work as expected.

    for (const d of data) {
      try {
        const response = await fetch(`http://localhost:3002/api/payments/${d}`, { // Assuming d is a payment ID
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: "accepted" }) // Assuming you want to update the status
        });
  
        const json = await response.json();
  
        if (response.ok) {
          dispatch({ type: "UPDATE_PAYMENT", payload: json });
        } else {
          console.error("Failed to update payment:", json);
        }
      } catch (error) {
        console.error("Error updating payment:", error);
      }
    }
  };
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="payments"
          render={() => (
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
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default PaymentVerify;
