import React from "react";
import GameList from "./GameList";
import GameForm from "./GameForm";

function GamePage() {
  return (
    <div className="container mx-auto my-8 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <GameList />
        </div>
        <div className="md:col-span-1">
          <div className="sticky top-4 ">
            <GameForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GamePage;
