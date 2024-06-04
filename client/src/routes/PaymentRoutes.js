import { Route, Routes } from "react-router-dom";
import PaymentList from "../pages/Payment/PaymentList";
import Payment from "../pages/Payment/Payment";
import NotFound from "../pages/NotFound";

function PaymentRoutes() {
  return (
    <Routes>
      <Route index element={<PaymentList />} />
      <Route path=":id" element={<Payment />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default PaymentRoutes;
