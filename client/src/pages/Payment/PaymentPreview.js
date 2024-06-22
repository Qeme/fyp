import { Badge } from "src/components/ui/badge";
import PreviewImage from "src/components/PreviewImage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";

const PaymentPreview = ({ tournamentid, payment }) => {
  return (
    <Card className="w-[400px] my-16">
      <CardHeader>
        <CardTitle>Preview Receipt</CardTitle>
        <CardDescription>
          Here is the details of your receipt that you have submitted. Always
          double check in case of any mistakes have been made.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center mt-4 text-center">
          <PreviewImage tournamentid={tournamentid} topic={"receipt"} />
          {payment ? (
            <div className="mt-4">
              {payment.organizer_message && (
                <blockquote className="italic text-gray-700 mb-2">
                  "{payment.organizer_message}"
                </blockquote>
              )}
              <Badge
                variant={
                  payment.status === "accepted" ? "accepted" : "rejected"
                }
              >
                {payment.status}
              </Badge>
            </div>
          ) : (
            <p>No payment information available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentPreview;
