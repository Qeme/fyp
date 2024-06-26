import React from "react";
import { useParams } from "react-router-dom";

function TournamentProgress() {
  const { id } = useParams();
  return (
    <main>
      <div>TournamentProgress {id}</div>
    </main>
  );
}

export default TournamentProgress;
