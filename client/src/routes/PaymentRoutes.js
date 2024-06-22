import { Route, Routes } from "react-router-dom";
import PaymentPage from "../pages/Payment/PaymentPage";
import Payment from "../pages/Payment/Payment";
import NotFound from "../pages/NotFound";

function PaymentRoutes() {
  return (
    <Routes>
      <Route index />
      <Route path=":id" element={<Payment />} />
      <Route path="/history" element={<PaymentPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default PaymentRoutes;
