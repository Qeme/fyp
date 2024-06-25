import { useTournamentContext } from "src/hooks/useTournamentContext";
import React from "react";
import { useAuthContext } from "src/hooks/useAuthContext";
import { usePaymentContext } from "src/hooks/usePaymentContext";
import { useUserContext } from "src/hooks/useUserContext";
import { Checkbox } from "src/components/ui/checkbox";

function PaymentVerify() {
  const { tournaments } = useTournamentContext();
  const { payments } = usePaymentContext();
  const { users } = useUserContext();
  const { user } = useAuthContext();

  return (
    <div>
      {tournaments &&
        tournaments
          .filter(
            (tournament) =>
              tournament.meta.organizer_id === user._id &&
              tournament.meta.status === "published"
          )
          .map((tournament) => (
            <div key={tournament._id}>
              <h2>Tournament Name: {tournament.name}</h2>
              {/* Render tournament ID or any other details */}
              {payments
                .filter(
                  (payment) =>
                    payment.tournamentid === tournament._id &&
                    payment.status === "pending"
                )
                .map((payment) => (
                  <div key={payment._id}>
                    
                    {payment && payment.payerid && (
                        
                      <div>
                        <Checkbox id="payment"/>
                        <p>Receipt ID: {payment.receiptid}</p>
                        <p>
                          Payer Email:{" "}
                          {
                            users.find((user) => user._id === payment.payerid)
                              .email
                          }
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
    </div>
  );
}

export default PaymentVerify;
