import { useAuthContext } from "../../hooks/useAuthContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { GameEditTrigger } from "./GameEditTrigger";
import { useInitialGame } from "src/hooks/useInitialGame";

// create a function to handle Listing all games to user
const GameList = () => {
  // grab the games and dispatch context data from GameContext by using custom hook
  const { games, dispatch } = useInitialGame();
  // grab the current user context data (it has _id and token information)
  const { user } = useAuthContext();

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
      <h3 className="text-2xl font-bold mb-4 text-left">Games List:</h3>
      {games &&
        games.map((game) => (
          <Card key={game._id} className="mb-2 shadow-sm p-2">
            <CardHeader className="p-2">
              <h4 className="text-lg font-bold">{game.name}</h4>
            </CardHeader>
            <CardContent className="p-2">
              <p className="text-gray-700 text-sm">
                <strong>Platform: </strong>
                {game.platform}
              </p>
              <p className="text-gray-500 text-sm">
                {formatDistanceToNow(new Date(game.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </CardContent>
            {user && user.role === "admin" && (
              <CardFooter className="text-right p-2">
                <Button
                  size="sm"
                  onClick={() => handleClick(game._id)}
                  className="mr-4 bg-red-500 hover:bg-red-700"
                >
                  Delete
                </Button>
                {/* pass the dispatch function to the GameEditTrigger component */}
                <GameEditTrigger game={game} dispatch={dispatch}/> 
              </CardFooter>
            )}
          </Card>
        ))}
    </div>
  );
};

export default GameList;
