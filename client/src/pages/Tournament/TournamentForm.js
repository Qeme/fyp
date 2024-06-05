import { useState } from "react";
import { useTournamentContext } from "../../hooks/useTournamentContext";
import { useGameContext } from "../../hooks/useGameContext";
import { useVenueContext } from "../../hooks/useVenueContext";

// create a function to handle tournament creation form
const TournamentForm = () => {
  // take the dispatch components from the hooks
  const { dispatch } = useTournamentContext();
  const { games } = useGameContext();
  const { venues } = useVenueContext();

  // set up the useState for 9 properties
  const [name, setName] = useState("");
  const [game_id, setGameid] = useState("");
  const [venue_id, setVenueid] = useState("");
  // to handle error message, we might use useState as well
  const [error, setError] = useState(null);
  // add additional state for emptyFields
  const [emptyFields, setEmptyFields] = useState([]);

  // create a function to handle CREATE submit button
  const handleSubmit = async (e) => {
    // prevent from by default to refresh the page
    e.preventDefault();

    // take those 7 variables that already being altered in the form
    const tournament = { name, game_id, venue_id };

    /*  
      1. we add method POST, cause it is to create tournaments
      2. body must include the tournaments as json format...so we use JSON.stringify
      3. header with content-type as JSON
    */
    const response = await fetch("http://localhost:3002/api/tournaments", {
      method: "POST",
      body: JSON.stringify(tournament),
      headers: { "Content-Type": "application/json" },
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
      setGameid("");
      setVenueid("");
      setError(null);
      setEmptyFields([]);

      /* 
        now call the dispatch from useTournamentContext hook to create new tournament
        we put payload : json as value because json has body of tournament: { _id, name, venue_id, game_id, createdAt, updatedAt }
      */
      dispatch({ type: "CREATE_TOURNAMENT", payload: json });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add A New Tournament</h2>

      <label>Name: </label>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
        className={emptyFields.includes("name") ? "error" : ""}
      />

      <label>Game: </label>
      <select
        onChange={(e) => setGameid(e.target.value)}
        value={game_id}
        className={emptyFields.includes("game") ? "error" : ""}
      >
        <option value="">--Choose--</option>
        {games.map((g) => (
          <option key={g._id} value={g._id}>
            {g.name}
          </option>
        ))}
      </select>

      <label>Venue: </label>
      <select
        onChange={(e) => setVenueid(e.target.value)}
        value={venue_id}
        className={emptyFields.includes("venue") ? "error" : ""}
      >
        <option value="">--Choose--</option>
        {venues.map((v) => (
          <option key={v._id} value={v._id}>
            {v.building}, {v.place}
          </option>
        ))}
      </select>

      <button>Add Tournament</button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default TournamentForm;
