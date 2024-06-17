import { Route, Routes } from "react-router-dom";
import NotFound from "../pages/NotFound";
import VenuePage from "src/pages/Venue/VenuePage";

function VenueRoutes() {
  return (
    <Routes>
      <Route index element={<VenuePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default VenueRoutes;
