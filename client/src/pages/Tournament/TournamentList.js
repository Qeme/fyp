import { useTournamentContext } from "../../hooks/useTournamentContext";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useUserContext } from "../../hooks/useUserContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useGameContext } from "../../hooks/useGameContext";
import { useVenueContext } from "../../hooks/useVenueContext";

// create a function to handle Listing all tournaments to user
const TournamentList = () => {
  // grab the tournaments and dispatch context data from TournamentContext by using custom hook
  const { tournaments, dispatch } = useTournamentContext();
  // grab the current user context data (it has _id and token information)
  const { user } = useAuthContext();
  const { users } = useUserContext();
  const { games } = useGameContext();
  const { venues } = useVenueContext();

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
    <>
      <div className="tournament-details">
        <h2>Tournaments List:</h2>
        {tournaments &&
          tournaments.map((tournament) => (
            <Link
              to={`/tournaments/${tournament._id}`}
              key={tournament._id}
              className="tournament-link"
            >
              <div className="tournament-item">
                <h3>{tournament.name}</h3>
                <div className="details">
                  <p>
                    Game:{" "}
                    {games.find((game) => game._id === tournament.meta.game_id)
                      ?.name || "Game not found"}
                  </p>
                  <p>
                    Venue:{" "}
                    {venues.find(
                      (venue) => venue._id === tournament.meta.venue_id
                    )?.building || "Venue not found"}
                  </p>
                  <p>
                    Organizer:{" "}
                    {users.find(
                      (user) => user._id === tournament.meta.organizer_id
                    )?.name || "Organizer not found"}
                  </p>
                </div>
                <p>
                  {formatDistanceToNow(new Date(tournament.createdAt), {
                    addSuffix: true,
                  })}
                </p>

                <span
                  className="material-symbols-outlined delete-icon"
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick(tournament._id);
                  }}
                >
                  delete
                </span>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
};

export default TournamentList;
