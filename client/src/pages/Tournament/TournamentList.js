import { useEffect } from "react";
import { useTournamentContext } from "../../hooks/useTournamentContext";
import { Link } from "react-router-dom";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

// create a function to handle Listing all tournaments to user
const TournamentList = () => {
  // grab the tournaments and dispatch context data from TournamentContext by using custom hook
  const { tournaments, dispatch } = useTournamentContext();

  /* 
    useEffect hook where it uses () => {} because we just want to call it once, not infinitly
    it has [] to be passed, so if [dispatch] changed, means it will rerun the useEffect hook
  */
  useEffect(() => {
    // create a function to fetch ALL the tournaments
    const fetchTournament = async () => {
      try {
        // create a variable to fetch
        const response = await fetch("http://localhost:3002/api/tournaments");
        // take the user input and pass it as json
        const json = await response.json();

        // check if response is ok or not
        if (response.ok) {
          // as we grab all the json tournaments data, we now SET the TOURNAMENTS by using the dispatch (from null to tournaments: tournaments)
          dispatch({ type: "SET_TOURNAMENTS", payload: json });
        } else {
          // if no response, send error to console
          console.error("Error fetching tournaments:", response.statusText);
        }
      } catch (error) {
        // this error indicates the fetching process not working at all, has backend problem
        console.error("Error fetching tournaments:", error);
      }
    };

    fetchTournament(); // call the fetchTournament here

  }, [dispatch]);

  // create a function to handle DELETE tournament by grabbing the id of the tournament as argument
  const handleClick = async (id) => {
    try {
      // create a variable to delete one particular id, make sure include method: DELETE
      const response = await fetch("http://localhost:3002/api/tournaments/" + id, {
        method: "DELETE",
      });

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
              <h4><Link to={`/tournaments/${tournament._id}`}>Name: {tournament.name}</Link></h4>
              {/* <p>
                <strong>Platform: </strong>
                {tournament.platform}
              </p> */}
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
