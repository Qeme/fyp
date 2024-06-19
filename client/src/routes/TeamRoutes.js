import { Route, Routes } from "react-router-dom";
import Team from "../pages/Team/Team";
import TeamForm from "../pages/Team/TeamForm";
import TeamList from "../pages/Team/TeamList";
import NotFound from "../pages/NotFound";
import TeamUserList from "../pages/Team/TeamUserList";

function TeamRoutes() {
  return (
    <Routes>
      <Route index element={<TeamList />} />
      <Route path=":id" element={<Team />} />
      <Route path="create" element={<TeamForm />} />
      <Route path="monitor" element={<TeamUserList />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default TeamRoutes;
