import React, { useState } from "react";
import PaymentList from "./PaymentList";
import PaymentPreview from "./PaymentPreview";

function PaymentPage() {
  const [selectedPayment, setSelectedPayment] = useState(null);

  return (
    <div className="flex justify-between my-8">
      <div className="w-3/5">
        <PaymentList onSelectPayment={setSelectedPayment} />
      </div>
      <div className="w-2/5">
        <div className="sticky top-4">
          <PaymentPreview payment={selectedPayment} />
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
