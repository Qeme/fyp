import React from "react";
import GameList from "./GameList";
import GameForm from "./GameForm";

function GamePage() {
  return (
    <div className="flex justify-between">
      <div className="w-3/5">
        <GameList />
      </div>
      <div className="w-2/5 mt-16">
        <div className="sticky top-8">
          <GameForm />
        </div>
      </div>
    </div>
  );
}

export default GamePage;
