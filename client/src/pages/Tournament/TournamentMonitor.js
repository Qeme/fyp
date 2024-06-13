import React from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useTournamentContext } from "../../hooks/useTournamentContext";
import { Link } from "react-router-dom";

function TournamentMonitor() {
  const { tournaments, dispatch } = useTournamentContext();
  const { user } = useAuthContext();

  const monitoredTournament = tournaments?.filter(
    (tournament) => tournament.meta.organizer_id === user._id
  );

  // create a function to handle DELETE tournament by grabbing the id of the tournament as argument
  const handleClick = async (id) => {
    // if no user at all, just disable the delete button functionality
    if (!user) {
      return;
    }

    try {
      // create a variable to delete one particular id, make sure include method: DELETE
      const response = await fetch(
        "http://localhost:3002/api/tournaments/" + id,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // pass the json data from response either as single data (deleted) or error data
      const json = await response.json();

      if (response.ok) {
        // as we grab all the json tournaments data, we now DELETE that TOURNAMENT by using the dispatch (filter the tournaments)
        dispatch({ type: "DELETE_TOURNAMENT", payload: json });
      } else {
        // if no response, send error to console
        console.error("Error deleting the tournament:", response.statusText);
      }
    } catch (error) {
      // this error indicates the fetching process not working at all, has backend problem
      console.error("Error fetching tournaments:", error);
    }
  };

  return (
    <div>
      {monitoredTournament && monitoredTournament.length > 0 ? (
        monitoredTournament.map((tournament) => (
          <div key={tournament._id} className="tournament-card">
            <h3>
              <Link to={`/tournaments/${tournament._id}`}>
                Name: {tournament.name}
              </Link>
            </h3>
            <span
                className="material-symbols-outlined"
                onClick={() => handleClick(tournament._id)}
              >
                delete
              </span>
          </div>
        ))
      ) : (
        <p>No Tournament To Monitor</p>
      )}
    </div>
  );
}

export default TournamentMonitor;
