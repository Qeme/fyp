import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "src/components/ui/button";
import { Checkbox } from "src/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";
import { useTournamentContext } from "src/hooks/useTournamentContext";
import { usePaymentContext } from "src/hooks/usePaymentContext";
import { useUserContext } from "src/hooks/useUserContext";
import { useAuthContext } from "src/hooks/useAuthContext";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";

const FormSchema = z.object({
  payments: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one item.",
  }),
  messages: z.string().optional(),
});

function PaymentVerifyOne() {
  const { id } = useParams();
  const { payments, dispatch } = usePaymentContext();
  const { tournaments, dispatch: dispatchTournament } = useTournamentContext();
  const { users } = useUserContext();
  const { user } = useAuthContext();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      payments: [],
      messages: "",
    },
  });

  const pendingPayments = payments.filter(
    (payment) => payment.tournamentid === id && payment.status === "pending"
  );

  const hasPendingPayments = pendingPayments.length > 0;

  const onSubmit = async (data, status) => {
    console.log(data);

    for (const d of data.payments) {
      try {
        const response = await fetch(
          `http://localhost:3002/api/payments/${d}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status, organizer_message: data.messages }),
          }
        );

        const json = await response.json();

        if (response.ok) {
          dispatch({ type: "UPDATE_PAYMENT", payload: json.payment });
          if (status === "accepted") {
            dispatchTournament({
              type: "UPDATE_TOURNAMENT",
              payload: json.tournament,
            });
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
    <main className="flex justify-center">
      <Card className="w-1/2 my-12 py-2">
        <CardHeader>
          <CardTitle className="text-center font-bold text-3xl">
            Payment Verification
          </CardTitle>
          <CardDescription className="text-center">
            Verify your participants' payments before they can participate and
            be involved in the tournament.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            {hasPendingPayments ? (
              <form
                onSubmit={form.handleSubmit((data) =>
                  onSubmit(data, "accepted")
                )}
                className="space-y-8 bg-white shadow-md rounded-lg p-6"
              >
                {tournaments &&
                  tournaments.find((tournament) => tournament._id === id) && (
                    <div>
                      <h2 className="text-lg font-semibold mt-4">
                        {
                          tournaments.find(
                            (tournament) => tournament._id === id
                          ).name
                        }
                      </h2>
                      {pendingPayments.map((payment) => (
                        <FormField
                          key={payment._id}
                          control={form.control}
                          name="payments"
                          render={({ field }) => (
                            <FormItem
                              key={payment._id}
                              className="flex flex-row items-start space-x-3 space-y-0 mt-2"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(payment._id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          payment._id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== payment._id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="flex-1">
                                <span className="font-semibold mr-8">Receipt ID:</span>{" "}
                                {payment.receiptid}
                                <br />
                                <span className="font-semibold mr-6">
                                  Payer Email:
                                </span>{" "}
                                {
                                  users.find(
                                    (user) => user._id === payment.payerid
                                  )?.email
                                }
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                      <FormField
                        control={form.control}
                        name="messages"
                        render={({ field }) => (
                          <FormItem className="mt-8">
                            <FormLabel className="text-lg font-bold">
                              Organizer Message
                            </FormLabel>
                            <textarea
                              {...field}
                              className="w-full border rounded p-2 mt-2"
                              rows={4}
                              placeholder="Enter your message here..."
                            />
                          </FormItem>
                        )}
                      />
                      <FormMessage />
                      <div className="flex justify-center">
                        <div className="flex space-x-4">
                          <Button
                            type="submit"
                            variant="accept"
                            onClick={form.handleSubmit((data) =>
                              onSubmit(data, "accepted")
                            )}
                          >
                            Accept
                          </Button>
                          <Button
                            type="button"
                            variant="reject"
                            onClick={form.handleSubmit((data) =>
                              onSubmit(data, "rejected")
                            )}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
              </form>
            ) : (
              <div className="text-center text-md font-semibold p-6">
                <p>No payment to be verified</p>
              </div>
            )}
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}

export default PaymentVerifyOne;
