import { useEffect } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "src/components/ui/card";
import { useAuthContext } from "src/hooks/useAuthContext";
import { useFileContext } from "src/hooks/useFileContext";
import { useTournamentContext } from "src/hooks/useTournamentContext";
import { usePaymentContext } from "src/hooks/usePaymentContext";
import { useTeamContext } from "src/hooks/useTeamContext";

// create a function to handle Listing all users to user
const PaymentList = () => {
  const { tournaments } = useTournamentContext();
  const { teams } = useTeamContext();
  const { files } = useFileContext();
  const { payments, dispatch } = usePaymentContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/payments", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const json = await response.json();

        if (response.ok) {
          dispatch({ type: "SET_PAYMENTS", payload: json });
        } else {
          console.error("Error getting the payments:", response.statusText);
        }
      } catch (error) {
        console.error("Error backend in fetching payments:", error);
      }
    };

    if (user) {
      fetchPayment();
    }
  }, [dispatch, user, payments]);

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-bold mb-4 text-left">Payment Pending:</h3>
      {payments &&
        payments
          .filter(
            (payment) =>
              payment.payerid === user._id && payment.status === "pending"
          )
          .map((payment) => (
            <Card key={payment._id} className="mb-6 shadow-sm p-4 border rounded-lg">
              <CardHeader className="p-2 mb-4">
                <h4 className="text-lg font-bold pl-4"># {payment.receiptid}</h4>
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
                  <strong className="text-gray-800 w-1/4">Join As</strong>
                  <span className="text-gray-700 w-3/4">{payment.payertype}</span>
                </div>
                <div className="pl-4 flex">
                  <strong className="text-gray-800 w-1/4">Representative</strong>
                  <span className="text-gray-700 w-3/4">
                    {payment.teamid
                      ? `team ${teams.find((team) => team._id === payment.teamid)?.name}`
                      : 'individual'}
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
