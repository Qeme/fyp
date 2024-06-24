import { Route, Routes } from "react-router-dom";
import TournamentList from "../pages/Tournament/TournamentList";
import Tournament from "../pages/Tournament/Tournament";
import TournamentForm from "../pages/Tournament/TournamentForm";
import NotFound from "../pages/NotFound";
import TournamentImage from "../pages/Tournament/TournamentImage";
import TournamentJoin from "../pages/Tournament/TournamentJoin";
import TournamentMonitor from "../pages/Tournament/TournamentMonitor";
import TournamentJoinForm from "../pages/Tournament/TournamentJoinForm";
import TournamentSetting from "../pages/Tournament/TournamentSetting";

function TournamentRoutes() {
  return (
    <Routes>
      <Route index element={<TournamentList />} />
      <Route path=":id" element={<Tournament />} />
      <Route path="join" element={<TournamentJoin />} />
      <Route path="join/:id" element={<TournamentJoinForm />} />
      <Route path="monitor" element={<TournamentMonitor />} />
      <Route path="create" element={<TournamentForm />} />
      <Route path="setting" element={<TournamentSetting />} />
      <Route path="upload-image/:id" element={<TournamentImage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default TournamentRoutes;
