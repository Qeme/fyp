import { useTournamentContext } from "src/hooks/useTournamentContext";
import React from "react";
import { useAuthContext } from "src/hooks/useAuthContext";
import { usePaymentContext } from "src/hooks/usePaymentContext";
import { useUserContext } from "src/hooks/useUserContext";
import { Checkbox } from "src/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import BackButton from "src/components/BackButton";

function PaymentVerifys() {
  const { tournaments } = useTournamentContext();
  const { payments } = usePaymentContext();
  const { users } = useUserContext();
  const { user } = useAuthContext();

  const filteredTournaments = tournaments.filter(
    (tournament) =>
      tournament.meta.organizer_id === user._id &&
      tournament.meta.status === "published"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Verification</CardTitle>
        <CardDescription>
          Verify your participants' payments before they can join the tournament
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              {filteredTournaments.length > 0 ? (
                filteredTournaments.map((tournament) => (
                  <div key={tournament._id}>
                    <h2>Tournament Name: {tournament.name}</h2>
                    {payments
                      .filter(
                        (payment) =>
                          payment.tournamentid === tournament._id &&
                          payment.status === "pending"
                      )
                      .map((payment) => (
                        <div key={payment._id}>
                          {payment && payment.payerid && (
                            <div className="flex items-center space-x-2">
                              <Checkbox id="payment" />
                              <div>
                                <p>Receipt ID: {payment.receiptid}</p>
                                <p>
                                  Payer Email:{" "}
                                  {users.find((user) => user._id === payment.payerid)?.email}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>

                ))

              ) : (
                <p>No Payment to evaluate</p>
              )}
            </div>
          </form>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between space-x-4">

          <BackButton />

          <Button>Verify</Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default PaymentVerifys;
