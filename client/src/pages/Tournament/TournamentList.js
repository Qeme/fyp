import { useTournamentContext } from "../../hooks/useTournamentContext";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

// create a function to handle Listing all tournaments to user
const TournamentList = () => {
  // grab the tournaments and dispatch context data from TournamentContext by using custom hook
  const { tournaments, dispatch } = useTournamentContext();
  // grab the current user context data (it has _id and token information)
  const { user } = useAuthContext();

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
      <div>
        <h3>Tournaments List:</h3>
        {/* 
          iterate all the tournaments that you have found where tournaments ISNT NULL
          we also use () instead of {} because we return a template 

          we use key (key={tournament._id}) for unique properties only & to optimize the rendering process and taking tournaments parameter as well
        */}
        {tournaments &&
          tournaments.map((tournament) => (
            <div key={tournament._id}>
              {/* we use the Link routes to link to detail of one particular tournament, we did pass the TOURNAMENT._ID as PARAMS */}
              <h4>
                <Link to={`/tournaments/${tournament._id}`}>
                  Name: {tournament.name}
                </Link>
              </h4>
              {/* instead of just showing the string of the date, u can use the date-fns to format them */}
              <p>
                {formatDistanceToNow(new Date(tournament.createdAt), {
                  addSuffix: true,
                })}
              </p>
              <span
                className="material-symbols-outlined"
                onClick={() => handleClick(tournament._id)}
              >
                delete
              </span>
            </div>
          ))}
      </div>
    </>
  );
};

export default TournamentList;
