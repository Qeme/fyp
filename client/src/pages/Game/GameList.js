import { useEffect } from "react";
import { useGameContext } from "../../hooks/useGameContext";
import { Link } from "react-router-dom";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

// create a function to handle Listing all games to user
const GameList = () => {
  // grab the games and dispatch context data from GameContext by using custom hook
  const { games, dispatch } = useGameContext();

  /* 
    useEffect hook where it uses () => {} because we just want to call it once, not infinitly
    it has [] to be passed, so if [dispatch] changed, means it will rerun the useEffect hook
  */
  useEffect(() => {
    // create a function to fetch ALL the games
    const fetchGame = async () => {
      try {
        // create a variable to fetch
        const response = await fetch("http://localhost:3002/api/games");
        // take the user input and pass it as json
        const json = await response.json();

        // check if response is ok or not
        if (response.ok) {
          // as we grab all the json games data, we now SET the GAMES by using the dispatch (from null to games: games)
          dispatch({ type: "SET_GAMES", payload: json });
        } else {
          // if no response, send error to console
          console.error("Error fetching games:", response.statusText);
        }
      } catch (error) {
        // this error indicates the fetching process not working at all, has backend problem
        console.error("Error fetching games:", error);
      }
    };

    fetchGame(); // call the fetchGame here

  }, [dispatch]);

  // create a function to handle DELETE game by grabbing the id of the game as argument
  const handleClick = async (id) => {
    try {
      // create a variable to delete one particular id, make sure include method: DELETE
      const response = await fetch("http://localhost:3002/api/games/" + id, {
        method: "DELETE",
      });

      // pass the json data from response either as single data (deleted) or error data
      const json = await response.json();

      if (response.ok) {
        // as we grab all the json games data, we now DELETE that GAME by using the dispatch (filter the games)
        dispatch({ type: "DELETE_GAME", payload: json });
      } else {
        // if no response, send error to console
        console.error("Error deleting the game:", response.statusText);
      }
    } catch (error) {
      // this error indicates the fetching process not working at all, has backend problem
      console.error("Error fetching games:", error);
    }
  };

  return (
    <>
      <div>
        <h3>Games List:</h3>
        {/* 
          iterate all the games that you have found where games ISNT NULL
          we also use () instead of {} because we return a template 

          we use key (key={game._id}) for unique properties only & to optimize the rendering process and taking games parameter as well
        */}
        {games &&
          games.map((game) => (
            <div key={game._id}>
              {/* we use the Link routes to link to detail of one particular game, we did pass the GAME._ID as PARAMS */}
              <h4><Link to={`/games/${game._id}`}>Name: {game.name}</Link></h4>
              <p>
                <strong>Platform: </strong>
                {game.platform}
              </p>
              {/* instead of just showing the string of the date, u can use the date-fns to format them */}
              <p>
                {formatDistanceToNow(new Date(game.createdAt), {
                  addSuffix: true,
                })}
              </p>
              <span
              className="material-symbols-outlined"
              onClick={() => handleClick(game._id)}
            >
              delete
            </span>
            </div>
          ))}
      </div>
    </>
  );
};

export default GameList;
