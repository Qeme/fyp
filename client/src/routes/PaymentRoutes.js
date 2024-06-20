import { Route, Routes } from "react-router-dom";
import PaymentPage from "../pages/Payment/PaymentPage";
import Payment from "../pages/Payment/Payment";
import NotFound from "../pages/NotFound";
import PaymentHistory from "src/pages/Payment/PaymentHistory";

function PaymentRoutes() {
  return (
    <Routes>
      <Route index />
      <Route path=":id" element={<Payment />} />
      <Route path="/pay" element={<PaymentPage />} />
      <Route path="/history" element={<PaymentHistory />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default PaymentRoutes;
