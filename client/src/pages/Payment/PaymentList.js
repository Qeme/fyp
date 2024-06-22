import React from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "src/components/ui/card";
import { useAuthContext } from "src/hooks/useAuthContext";
import { useInitialPayment } from "src/hooks/useInitialPayment";
import { useInitialTournament } from "src/hooks/useInitialTournament";
import { useInitialTeam } from "src/hooks/useInitialTeam";

const PaymentList = ({ onSelectTournament, onSelectPayment }) => {
  const { payments } = useInitialPayment();
  const { tournaments } = useInitialTournament();
  const { teams } = useInitialTeam();
  const { user } = useAuthContext();

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-bold mb-4 text-left">Payment History:</h3>
      {payments &&
        payments
          .filter(
            (payment) =>
              payment.payerid === user._id && payment.status !== "pending"
          )
          .map((payment) => (
            <Card
              key={payment._id}
              className="mb-6 shadow-sm p-4 border rounded-lg cursor-pointer"
              onClick={() => {
                onSelectTournament(payment.tournamentid);
                onSelectPayment(payment);
              }}
            >
              <CardHeader className="p-2 mb-4">
                <h4 className="text-lg font-bold pl-4">
                  # {payment.receiptid}
                </h4>
              </CardHeader>
              <CardContent className="p-2">
                <div className="pl-4 flex">
                  <strong className="text-gray-800 w-1/4">Tournament</strong>
                  <span className="text-gray-700 w-3/4">
                    {payment.tournamentid &&
                      tournaments.find(
                        (tournament) => tournament._id === payment.tournamentid
                      )?.name}
                  </span>
                </div>
                <div className="pl-4 flex">
                  <strong className="text-gray-800 w-1/4">
                    Representative
                  </strong>
                  <span className="text-gray-700 w-3/4">
                    {payment.teamid
                      ? `team ${
                          teams.find((team) => team._id === payment.teamid)
                            ?.name
                        }`
                      : "individual"}
                  </span>
                </div>
                <div className="pl-4 flex">
                  <strong className="text-gray-800 w-1/4">Join As</strong>
                  <span className="text-gray-700 w-3/4">
                    {payment.payertype}
                  </span>
                </div>
                <div className="pl-4 flex">
                  <strong className="text-gray-800 w-1/4">Ticket Price</strong>
                  <span className="text-gray-700 w-3/4">
                    RM{" "}
                    {payment.tournamentid &&
                      (() => {
                        const tournament = tournaments.find(
                          (tournament) =>
                            tournament._id === payment.tournamentid
                        );
                        if (tournament && payment.payertype) {
                          return payment.payertype === "competitor"
                            ? tournament.meta.ticket.competitor
                            : payment.payertype === "viewer"
                            ? tournament.meta.ticket.viewer
                            : "N/A"; // Handle other cases or default
                        }
                        return "N/A";
                      })()}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-gray-500 text-sm text-left">
                  {formatDistanceToNow(new Date(payment.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </CardFooter>
            </Card>
          ))}
    </div>
  );
};

export default PaymentList;
