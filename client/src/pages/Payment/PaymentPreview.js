import { Badge } from "src/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import PreviewReceipt from "src/components/PreviewReceipt";

const PaymentPreview = ({ payment }) => {
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
        <div className="grid w-full items-center my-2 text-center">
          {payment ? (
            <div>
              <PreviewReceipt receiptid={payment.receiptid} />
              <div className="mt-4">
                {payment.organizer_message && (
                  <blockquote className="italic text-gray-700 mb-2">
                    "{payment.organizer_message}"
                  </blockquote>
                )}
                <Badge
                  variant={
                    payment.status === "accepted"
                      ? "accepted"
                      : payment.status === "rejected"
                      ? "rejected"
                      : "pending"
                  }
                >
                  {payment.status}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <p>No payment information available.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentPreview;
