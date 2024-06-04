import { Route, Routes } from "react-router-dom";
import VenueList from "../pages/Venue/VenueList";
import Venue from "../pages/Venue/Venue";
import VenueForm from "../pages/Venue/VenueForm";
import NotFound from "../pages/NotFound";

function VenueRoutes() {
  return (
    <Routes>
      <Route index element={<VenueList />} />
      <Route path=":id" element={<Venue />} />
      <Route path="create" element={<VenueForm />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default VenueRoutes;
