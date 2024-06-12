import React from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useTournamentContext } from "../../hooks/useTournamentContext";

function TournamentJoin() {
  const { tournaments } = useTournamentContext();
  const { user } = useAuthContext();

  const publishedTournaments = tournaments?.filter(
    (tournament) =>
      tournament.meta.status === "published" &&
      tournament.meta.organizer_id !== user._id
  );

  return (
    <div>
      {publishedTournaments && publishedTournaments.length > 0 ? (
        publishedTournaments.map((tournament) => (
          <div key={tournament._id} className="tournament-card">
            <h3>{tournament.name}</h3>
          </div>
        ))
      ) : (
        <p>No Tournament To Join</p>
      )}
    </div>
  );
}

export default TournamentJoin;
