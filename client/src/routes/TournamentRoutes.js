import { Route, Routes } from "react-router-dom";
import TournamentList from "../pages/Tournament/TournamentList";
import Tournament from "../pages/Tournament/Tournament";
import TournamentForm from "../pages/Tournament/TournamentForm";
import NotFound from "../pages/NotFound";

function TournamentRoutes() {
  return (
    <Routes>
      <Route index element={<TournamentList />} />
      <Route path=":id" element={<Tournament />} />
      <Route path="create" element={<TournamentForm />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default TournamentRoutes;
