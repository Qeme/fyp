import { Route, Routes } from "react-router-dom";
import PaymentPage from "../pages/Payment/PaymentPage";
import NotFound from "../pages/NotFound";
import PaymentVerify from "../pages/Payment/PaymentVerify";
import PaymentVerifyOne from "src/pages/Payment/PaymentVerifyOne";

function PaymentRoutes() {
  return (
    <Routes>
      <Route index />
      <Route path="/history" element={<PaymentPage />} />
      <Route path="/verify" element={<PaymentVerify />} />
      <Route path="/verify/:id" element={<PaymentVerifyOne />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default PaymentRoutes;
