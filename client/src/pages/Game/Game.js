import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGameContext } from "../../hooks/useGameContext";

// create a function to get the detail of one particular game
const Game = () => {
  // we grab the id as params, similar to backend 
  const { id } = useParams();
  // grab the updated games from the GameContext()
  const { games } = useGameContext();
  // create 2 useState variables for this particular page
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 
    useEffect hook where it uses () => {} because we just want to call it once, not infinitly
    it has [] to be passed, so if [id, games] changed, means it will rerun the useEffect hook
  */
  useEffect(() => {
    // during the finding the game, make the Loading equals to true
    setLoading(true);
    // try find the that particular game from the games using id params
    const foundGame = games.find((g) => g._id === id);

    if (foundGame) {
      // if found, execute setGame to change the value from null to that game information
      setGame(foundGame);
    } else {
      // if not found, just reset it back to null
      setGame(null);
    }

    // after all finish, change back Loading to false
    setLoading(false);
    
  }, [id, games]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!game) {
    return <div>Game not found</div>;
  }

  return (
    <div>
      <h2>Game ID: {game._id}</h2>
      <p>Name: {game.name}</p>
      <p>Platform: {game.platform}</p>
    </div>
  );
};

export default Game;
