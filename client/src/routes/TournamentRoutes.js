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
import TournamentProgress from "src/pages/Tournament/TournamentProgress";
import TournamentBracketParticipate from "src/pages/Tournament/TournamentBracketParticipate";
import TournamentReferee from "src/pages/Tournament/TournamentReferee";
import TournamentAllPlayAllPreview from "src/pages/Tournament/TournamentAllPlayAllPreview";
import TournamentSingleEliminationPreview from "src/pages/Tournament/TournamentSingleEliminationPreview";
import TournamentDoubleEliminationPreview from "src/pages/Tournament/TournamentDoubleEliminationPreview";

function TournamentRoutes() {
  return (
    <Routes>
      <Route index element={<TournamentList />} />
      <Route path=":id" element={<Tournament />} />
      <Route path="/bracket/:id" element={<TournamentBracketParticipate />} />
      <Route path="join" element={<TournamentJoin />} />
      <Route path="join/:id" element={<TournamentJoinForm />} />
      <Route path="monitor" element={<TournamentMonitor />} />
      <Route path="referee" element={<TournamentReferee />} />
      <Route path="create" element={<TournamentForm />} />
      <Route path="preview/playall/:id" element={<TournamentAllPlayAllPreview />} />
      <Route path="preview/single/:id" element={<TournamentSingleEliminationPreview />} />
      <Route path="preview/double/:id" element={<TournamentDoubleEliminationPreview />} />
      <Route path="setting" element={<TournamentSetting />} />
      <Route path="progress/:id" element={<TournamentProgress />} />
      <Route path="upload-image/:id" element={<TournamentImage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default TournamentRoutes;
