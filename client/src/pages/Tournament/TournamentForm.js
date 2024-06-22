import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useInitialGame } from "src/hooks/useInitialGame";
import { useInitialTournament } from "src/hooks/useInitialTournament";
import { useInitialVenue } from "src/hooks/useInitialVenue";

// create a function to handle tournament creation form
const TournamentForm = () => {
  const navigate = useNavigate();

  // take the dispatch components from the hooks
  const { dispatch } = useInitialTournament();
  const { games } = useInitialGame();
  const { venues } = useInitialVenue();
  const { user } = useAuthContext();

  // set up the useState for 9 properties
  const [name, setName] = useState("");
  const [game_id, setGameid] = useState("");
  const [venue_id, setVenueid] = useState("");
  const [stageOne, setStageOne] = useState({ format: "", maxPlayers: "" });
  const [stageTwo, setStageTwo] = useState({
    format: "",
    advance: { method: "", value: "" },
  });
  const [register, setRegister] = useState({ open: "", close: "" });
  const [running, setRunning] = useState({ start: "", end: "" });
  const [checkin, setCheckin] = useState("");
  const [notification, setNotification] = useState({
    rules: "",
    regulation: "",
  });
  const [ticket, setTicket] = useState({ competitor: "", viewer: "" });
  const [representative, setRepresentative] = useState({
    repType: "",
    numPlayers: "",
  });
  const [colored, setColored] = useState("");
  const [sorting, setSorting] = useState("");
  const [scoring, setScoring] = useState({
    win: "",
    loss: "",
    draw: "",
    bestOf: "",
    bye: "",
    tiebreaks: "",
  });

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

    // take those 7 variables that already being altered in the form
    const tournament = {
      name,
      game_id,
      venue_id,
      stageOne,
      stageTwo,
      register,
      running,
      checkin,
      notification,
      ticket,
      representative,
      colored,
      sorting,
      scoring,
    };

    /*  
      1. we add method POST, cause it is to create tournaments
      2. body must include the tournaments as json format...so we use JSON.stringify
      3. header with content-type as JSON
    */
    const response = await fetch("http://localhost:3002/api/tournaments", {
      method: "POST",
      body: JSON.stringify(tournament),
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
      setGameid("");
      setVenueid("");
      setStageOne({ format: "", maxPlayers: "" });
      setStageTwo({
        format: "",
        advance: { method: "", value: "" },
      });
      setRegister({ open: "", close: "" });
      setRunning({ start: "", end: "" });
      setCheckin("");
      setNotification({
        rules: "",
        regulation: "",
      });
      setTicket({ competitor: "", viewer: "" });
      setRepresentative({
        repType: "",
        numPlayers: "",
      });
      setColored("");
      setSorting("");
      setScoring({
        win: "",
        loss: "",
        draw: "",
        bestOf: "",
        bye: "",
        tiebreaks: "",
      });
      setError(null);
      setEmptyFields([]);

      /* 
        now call the dispatch from useInitialTournament hook to create new tournament
        we put payload : json as value because json has body of tournament: { _id, name, venue_id, game_id, createdAt, updatedAt }
      */
      dispatch({ type: "CREATE_TOURNAMENT", payload: json });

      navigate(`/tournaments/upload-image/${json._id}`);
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

      <h2>
        <strong>Representative: </strong>
      </h2>

      <label>Type: </label>
      <select
        onChange={(e) =>
          setRepresentative({ ...representative, repType: e.target.value })
        }
        value={representative.repType}
      >
        <option value="">--Choose--</option>
        <option value="individual">Individual</option>
        <option value="team">Team</option>
      </select>

      <label>Number of team: </label>
      <input
        type="number"
        onChange={(e) =>
          setRepresentative({ ...representative, numPlayers: e.target.value })
        }
        value={representative.numPlayers}
      />

      <h2>
        <strong>Basic Configuration: </strong>
      </h2>

      <h3>
        <strong>Order & Sorting: </strong>
      </h3>

      <label>Players Order: </label>
      <select onChange={(e) => setColored(e.target.value)} value={colored}>
        <option value="">--Choose--</option>
        <option value="true">Yes, it matters</option>
        <option value="false">No, it can be random</option>
      </select>

      <label>Players Sorting: </label>
      <select onChange={(e) => setSorting(e.target.value)} value={sorting}>
        <option value="">--Choose--</option>
        <option value="none">No Sorting</option>
        <option value="ascending">Ascending</option>
        <option value="descending">Descending</option>
      </select>

      <h3>
        <strong>Score Value: </strong>
      </h3>

      <label>Win: </label>
      <input
        type="number"
        onChange={(e) => setScoring({ ...scoring, win: e.target.value })}
        value={scoring.win}
      />

      <label>Loss: </label>
      <input
        type="number"
        onChange={(e) => setScoring({ ...scoring, loss: e.target.value })}
        value={scoring.loss}
      />

      <label>Draw: </label>
      <input
        type="number"
        onChange={(e) => setScoring({ ...scoring, draw: e.target.value })}
        value={scoring.draw}
      />

      <label>Best Of: </label>
      <input
        type="number"
        onChange={(e) => setScoring({ ...scoring, bestOf: e.target.value })}
        value={scoring.bestOf}
      />

      <label>Bye: </label>
      <input
        type="number"
        onChange={(e) => setScoring({ ...scoring, bye: e.target.value })}
        value={scoring.bye}
      />

      <h3>
        <strong>3rd Placement: </strong>
      </h3>

      <label>Tiebreaker Format: </label>
      <select
        onChange={(e) => setScoring({ ...scoring, tiebreaks: e.target.value })}
        value={scoring.tiebreaks}
      >
        <option value="">--Choose--</option>
        <option value="median buchholz">median buchholz</option>
        <option value="solkoff">solkoff</option>
        <option value="sonneborn berger">sonneborn berger</option>
        <option value="cumulative">cumulative</option>
        <option value="versus">versus</option>
        <option value="opponent game win percentage">
          opponent game win percentage
        </option>
        <option value="opponent match win percentage">
          opponent match win percentage
        </option>
        <option value="opponent opponent match win percentage">
          opponent opponent match win percentage
        </option>
      </select>

      <h2>
        <strong>Stages</strong>
      </h2>
      <h3>Stage One:</h3>

      <label>Format: </label>
      <select
        onChange={(e) => setStageOne({ ...stageOne, format: e.target.value })}
        value={stageOne.format}
      >
        <option value="">--Choose--</option>
        <option value="single-elimination">Single Elimination</option>
        <option value="double-elimination">Double Elimination</option>
        <option value="stepladder">Stepladder</option>
        <option value="swiss">Swiss</option>
        <option value="round-robin">Round Robin</option>
        <option value="double-round-robin">Double Round Robin</option>
      </select>

      <label>Max Players: </label>
      <input
        type="number"
        onChange={(e) =>
          setStageOne({ ...stageOne, maxPlayers: e.target.value })
        }
        value={stageOne.maxPlayers}
      />

      <h3>Stage Two:</h3>

      <label>Format: </label>
      <select
        onChange={(e) => setStageTwo({ ...stageTwo, format: e.target.value })}
        value={stageTwo.format}
      >
        <option value="">--Choose--</option>
        <option value="single-elimination">Single Elimination</option>
        <option value="double-elimination">Double Elimination</option>
        <option value="stepladder">Stepladder</option>
      </select>

      <label>Advance Method: </label>
      <select
        onChange={(e) =>
          setStageTwo({
            ...stageTwo,
            advance: { ...stageTwo.advance, method: e.target.value },
          })
        }
        value={stageTwo.advance.method}
      >
        <option value="">--Choose--</option>
        <option value="points">By Points (greater or equal)</option>
        <option value="rank">By Ranking (less or equal)</option>
        <option value="all">Everyone Advance</option>
      </select>

      <label>Advance Value: </label>
      <input
        type="number"
        onChange={(e) =>
          setStageTwo({
            ...stageTwo,
            advance: { ...stageTwo.advance, value: e.target.value },
          })
        }
        value={stageTwo.advance.value}
        min={0}
      ></input>

      <h2>
        <strong>Registration</strong>
      </h2>

      <label>Open Date Time: </label>
      <input
        type="date"
        onChange={(e) => setRegister({ ...register, open: e.target.value })}
        value={register.open}
      ></input>

      <label>Close Date Time: </label>
      <input
        type="date"
        onChange={(e) => setRegister({ ...register, close: e.target.value })}
        value={register.close}
      ></input>

      <h2>
        <strong>Running</strong>
      </h2>

      <label>Start Date Time: </label>
      <input
        type="date"
        onChange={(e) => setRunning({ ...running, start: e.target.value })}
        value={running.start}
      ></input>

      <label>End Date Time: </label>
      <input
        type="date"
        onChange={(e) => setRunning({ ...running, end: e.target.value })}
        value={running.end}
      ></input>

      <label>Check In Time (minutes): </label>
      <input
        type="number"
        onChange={(e) => setCheckin(e.target.value)}
        value={checkin}
      ></input>

      <h2>
        <strong>Notification</strong>
      </h2>

      <label>Rules: </label>
      <input
        type="text"
        onChange={(e) =>
          setNotification({ ...notification, rules: e.target.value })
        }
        value={notification.rules}
      ></input>

      <label>Regulation: </label>
      <input
        type="text"
        onChange={(e) =>
          setNotification({ ...notification, regulation: e.target.value })
        }
        value={notification.regulation}
      ></input>

      <h2>
        <strong>Ticket Price</strong>
      </h2>

      <label>Competitor: </label>
      <input
        type="number"
        onChange={(e) => setTicket({ ...ticket, competitor: e.target.value })}
        value={ticket.competitor}
      ></input>

      <label>Spectator: </label>
      <input
        type="number"
        onChange={(e) => setTicket({ ...ticket, viewer: e.target.value })}
        value={ticket.viewer}
      ></input>

      <button>Add Tournament</button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default TournamentForm;
