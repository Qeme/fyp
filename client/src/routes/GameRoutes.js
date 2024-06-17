import { Route, Routes } from "react-router-dom";
import NotFound from "../pages/NotFound";
import GamePage from "../pages/Game/GamePage";

function GameRoutes() {
  return (
    <Routes>
      <Route index element={<GamePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default GameRoutes;
