import { useEffect } from "react";
import { useGameContext } from "../../hooks/useGameContext";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { Card, CardContent, CardFooter, CardHeader } from "src/components/ui/card";
import { Button } from "src/components/ui/button";

// create a function to handle Listing all games to user
const GameList = () => {
  // grab the games and dispatch context data from GameContext by using custom hook
  const { games, dispatch } = useGameContext();
  // grab the current user context data (it has _id and token information)
  const { user } = useAuthContext();

  /* 
    useEffect hook where it uses () => {} because we just want to call it once, not infinitly
    it has [] to be passed, so if [dispatch] changed, means it will rerun the useEffect hook
  */
  useEffect(() => {
    // create a function to fetch ALL the games
    const fetchGame = async () => {
      try {
        // create a variable to fetch
        const response = await fetch("http://localhost:3002/api/games", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
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

    // call the function if the user exist only
    if (user) {
      fetchGame(); // call the fetchGame here
    }
  }, [dispatch, user]); //include user as well, as it acts as depedencies

  // create a function to handle DELETE game by grabbing the id of the game as argument
  const handleClick = async (id) => {
    // if no user at all, just disable the delete button functionality
    if (!user) {
      return;
    }

    try {
      // create a variable to delete one particular id, make sure include method: DELETE
      const response = await fetch("http://localhost:3002/api/games/" + id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
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
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-semibold mb-4">Games List:</h3>
      {games &&
        games.map((game) => (
          <Card key={game._id} className="mb-2 shadow-sm p-2">
            <CardHeader className="p-2">
              <h4 className="text-lg font-bold">
                <Link to={`/games/${game._id}`} className="text-blue-600 hover:underline">
                  {game.name}
                </Link>
              </h4>
            </CardHeader>
            <CardContent className="p-2">
              <p className="text-gray-700 text-sm">
                <strong>Platform: </strong>{game.platform}
              </p>
              <p className="text-gray-500 text-sm">
                {formatDistanceToNow(new Date(game.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </CardContent>
            {user && user.role === 'admin' && (
              <CardFooter className="text-right p-2">
                <Button variant="destructive" size="sm" onClick={() => handleClick(game._id)}>
                  Delete
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
    </div>
  );
};

export default GameList;
