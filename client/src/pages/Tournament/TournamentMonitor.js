import React from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useTournamentContext } from "../../hooks/useTournamentContext";

function TournamentMonitor() {
  const { tournaments } = useTournamentContext();
  const { user } = useAuthContext();

  const monitoredTournament = tournaments?.filter(
    (tournament) =>
      tournament.meta.organizer_id === user._id
  );

  return (
    <div>
      {monitoredTournament && monitoredTournament.length > 0 ? (
        monitoredTournament.map((tournament) => (
          <div key={tournament._id} className="tournament-card">
            <h3>{tournament.name}</h3>
          </div>
        ))
      ) : (
        <p>No Tournament To Monitor</p>
      )}
    </div>
  );
}

export default TournamentMonitor;
