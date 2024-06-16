import { Route, Routes } from "react-router-dom";
import GameList from "../pages/Game/GameList";
import Game from "../pages/Game/Game";
import GameForm from "../pages/Game/GameForm";
import NotFound from "../pages/NotFound";
import GamePage from "../pages/Game/GamePage";

function GameRoutes() {
  return (
    <Routes>
      <Route index element={<GameList />} />
      <Route path=":id" element={<Game />} />
      <Route path="create" element={<GameForm />} />
      <Route path="home" element={<GamePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default GameRoutes;
