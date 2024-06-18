import { Route, Routes } from "react-router-dom";
import NotFound from "../pages/NotFound";
import RefereePage from "src/pages/Referee/RefereePage";

function RefereeRoutes() {
  return (
    <Routes>
      <Route index element={<RefereePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default RefereeRoutes;
