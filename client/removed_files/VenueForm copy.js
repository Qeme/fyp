import { useState } from "react";
import { useVenueContext } from "../../hooks/useVenueContext";
import { useAuthContext } from "../../hooks/useAuthContext";

// create a function to handle venue creation form
const VenueForm = () => {
  // take the dispatch components from the hooks
  const { dispatch } = useVenueContext();
  const { user } = useAuthContext();

  // set up the useState for 9 properties
  const [block, setBlock] = useState("");
  const [floorLevel, setFloorLevel] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [place, setPlace] = useState("");
  const [postcode, setPostcode] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  // to handle error message, we might use useState as well
  const [error, setError] = useState(null);
  // add additional state for emptyFields
  const [emptyFields, setEmptyFields] = useState([]);

  // create a function to handle CREATE submit button
  const handleSubmit = async (e) => {
    // prevent from by default to refresh the page
    e.preventDefault();

    // if no user, just return
    if (!user) {
      setError("You must be logged in");
      return;
    }

    // take those 7 variables that already being altered in the form
    const venue = {
      block,
      floorLevel,
      roomNumber,
      place,
      postcode,
      state,
      country,
    };

    /*  
      1. we add method POST, cause it is to create venues
      2. body must include the venues as json format...so we use JSON.stringify
      3. header with content-type as JSON
    */
    const response = await fetch("http://localhost:3002/api/venues", {
      method: "POST",
      body: JSON.stringify(venue),
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
      setBlock("");
      setFloorLevel("");
      setRoomNumber("");
      setPlace("");
      setPostcode("");
      setState("");
      setCountry("");
      setError(null);
      setEmptyFields([]);

      /* 
        now call the dispatch from useVenueContext hook to create new venue
        we put payload : json as value because json has body of venue: { _id, block, floorLevel, roomNumber, place, postcode, state, country, createdAt, updatedAt }
      */
      dispatch({ type: "CREATE_VENUE", payload: json });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add A New Venue</h2>
      <label>Block: </label>
      {/* 
        onChange where e is event, when it is changed from null to certain value, we take the e.target.value
        value={block} it takes the value from block that currently null 

        setup the input classBlock into error if there is error
        if the emptyFields includes 'block' then we make the classBlock into 'error' if not ''
      */}
      <input
        type="text"
        onChange={(e) => setBlock(e.target.value)}
        value={block}
        className={emptyFields.includes("block") ? "error" : ""}
      />

      <label>Floor Level: </label>
      <input
        type="number"
        onChange={(e) => setFloorLevel(e.target.value)}
        value={floorLevel}
      />

      <label>Room Number: </label>
      <input
        type="number"
        onChange={(e) => setRoomNumber(e.target.value)}
        value={roomNumber}
      />

      <label>Place: </label>
      <input
        type="text"
        onChange={(e) => setPlace(e.target.value)}
        value={place}
        className={emptyFields.includes("place") ? "error" : ""}
      />

      <label>Postcode: </label>
      <input
        type="number"
        onChange={(e) => setPostcode(e.target.value)}
        value={postcode}
        className={emptyFields.includes("postcode") ? "error" : ""}
      />

      <label>State: </label>
      <input
        type="text"
        onChange={(e) => setState(e.target.value)}
        value={state}
        className={emptyFields.includes("state") ? "error" : ""}
      />

      <label>Country: </label>
      <input
        type="text"
        onChange={(e) => setCountry(e.target.value)}
        value={country}
        className={emptyFields.includes("country") ? "error" : ""}
      />

      {/* 
        as you can see, there is no need to put action="" inside form tag,
        we just need to create onSubmit function 
        For this case we create handleSubmit func where it will be triggered when Add Venue button is clicked
      */}
      <button>Add Venue</button>

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

export default VenueForm;
