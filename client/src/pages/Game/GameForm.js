import { useState } from "react";
import { useGameContext } from "../../hooks/useGameContext";
import { useAuthContext } from "../../hooks/useAuthContext";

// create a function to handle game creation form
const GameForm = () => {
  // take the dispatch components from the hooks
  const { dispatch } = useGameContext();
  const { user } = useAuthContext();

  // set up the useState for 4 properties
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("");
  // to handle error message, we might use useState as well
  const [error, setError] = useState(null);
  // add additional state for emptyFields
  const [emptyFields, setEmptyFields] = useState([]);

  // create a function to handle CREATE submit button
  const handleSubmit = async (e) => {
    // prevent from by default to refresh the page
    e.preventDefault();

    // if no user at all, we can return
    if (!user) {
      setError("You must be logged in");
      return;
    }

    // take those 2 variables that already being altered in the form
    const game = { name, platform };

    /*  
      1. we add method POST, cause it is to create games
      2. body must include the games as json format...so we use JSON.stringify
      3. header with content-type as JSON
    */
    const response = await fetch("http://localhost:3002/api/games", {
      method: "POST",
      body: JSON.stringify(game),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    /* 
      basically we take back the json from the server to here
      if we got error as well, it will be return into json 
    */
    const json = await response.json();

    // take the json error message and change the error variable
    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }

    // after all done, reset all the variables including error and set back the EmptyFields to empty array
    if (response.ok) {
      setName("");
      setPlatform("");
      setError(null);
      setEmptyFields([]);

      /* 
        now call the dispatch from useGameContext hook to create new game
        we put payload : json as value because json has body of game: { _id, name, platform, createdAt, updatedAt }
      */
      dispatch({ type: "CREATE_GAME", payload: json });
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Add A New Game</h2>
      <label>Game Name: </label>
      {/* 
        onChange where e is event, when it is changed from null to certain value, we take the e.target.value
        value={name} it takes the value from name that currently null 

        setup the input className into error if there is error
        if the emptyFields includes 'title' then we make the className into 'error' if not ''
      */}
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
        className={emptyFields.includes("name") ? "error" : ""}
      />

      <label>Platform: </label>
      <select
        onChange={(e) => setPlatform(e.target.value)}
        value={platform}
        className={emptyFields.includes("platform") ? "error" : ""}
      >
        <option value="">--Choose--</option>
        <option value="online">Online</option>
        <option value="physical">Physical</option>
        <option value="hybrid">Hybrid</option>
        <option value="to be announced">To Be Announced</option>
      </select>

      {/* 
        as you can see, there is no need to put action="" inside form tag,
        we just need to create onSubmit function 
        For this case we create handleSubmit func where it will be triggered when Add Game button is clicked
      */}
      <button>Add Game</button>

      {/* 
        to see the error down there
        Description: {error && ...}: This is a JavaScript logical AND operator (&&). 
                    It checks if the error variable has a truthy value.
                    If error is truthy (i.e., not null, undefined, 0, false, or an empty string), 
                    the expression evaluates to true. Otherwise, it evaluates to false. 
      */}
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default GameForm;
