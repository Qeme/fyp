import { Route, Routes } from "react-router-dom";
import PaymentPage from "../pages/Payment/PaymentPage";
import NotFound from "../pages/NotFound";

function PaymentRoutes() {
  return (
    <Routes>
      <Route index />
      <Route path="/history" element={<PaymentPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default PaymentRoutes;
