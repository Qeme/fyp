import React from "react";
import GameList from './GameList'
import GameForm from './GameForm'

function GamePage() {
  return (
    <div className="game-home">
      <div>
        <GameList />
      </div>
      <div>
        <GameForm />
      </div>
    </div>
  );
}

export default GamePage;
