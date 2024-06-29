import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Label } from "src/components/ui/label";
import { Input } from "src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { DatePickerWithRange } from "src/components/CalendarInput";
import { addDays, format } from "date-fns";
import { Textarea } from "src/components/ui/textarea";
import { useTournamentContext } from "src/hooks/useTournamentContext";
import { useGameContext } from "src/hooks/useGameContext";
import { useVenueContext } from "src/hooks/useVenueContext";
import { Button } from "src/components/ui/button";
import BackButton from "src/components/BackButton";
import { useUserContext } from "src/hooks/useUserContext";

// create a function to handle tournament creation form
const TournamentForm = () => {
  const navigate = useNavigate();

  // take the dispatch components from the hooks
  const { dispatch } = useTournamentContext();
  const { games } = useGameContext();
  const { venues } = useVenueContext();
  const { users } = useUserContext();
  const { user } = useAuthContext();

  // set up the useState for 9 properties
  const [name, setName] = useState("");
  const [game_id, setGameid] = useState("");
  const [venue_id, setVenueid] = useState("");
  const [stageOne, setStageOne] = useState({ format: "", maxPlayers: "" });
  const [stageTwo, setStageTwo] = useState({
    format: "",
    advance: { method: "all", value: "" },
  });
  const [register, setRegister] = useState({
    open: format(new Date(), "yyyy-MM-dd"),
    close: format(addDays(new Date(), 20), "yyyy-MM-dd"),
  });
  const [running, setRunning] = useState({
    start: format(new Date(), "yyyy-MM-dd"),
    end: format(addDays(new Date(), 20), "yyyy-MM-dd"),
  });
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
  const [sorting, setSorting] = useState("none");
  const [scoring, setScoring] = useState({
    win: "",
    loss: "",
    draw: "",
    bestOf: "",
    bye: "",
    // tiebreaks: "",
  });
  const [referee_id, setRefereeID] = useState(null);

  // to handle error message, we might use useState as well
  const [error, setError] = useState(null);
  // add additional state for emptyFields
  const [emptyFields, setEmptyFields] = useState([]);
  // State to manage input disable/enable
  const [disableInput, setDisableInput] = useState(true);
  const [disableInputSort, setDisableInputSort] = useState(true);
  const [disableInputStage, setDisableInputStage] = useState(true);

  // Function to handle changes in representative.repType
  const handleRepresentativeChange = (selectedOption) => {
    setRepresentative({
      ...representative,
      repType: selectedOption,
    });

    // Handle disabling based on repType
    const disableInput =
      selectedOption === "individual" || selectedOption === "";
    setDisableInput(disableInput);

    // Reset numPlayers if switching to individual
    if (disableInput) {
      setRepresentative((prevRep) => ({
        ...prevRep,
        numPlayers: "",
      }));
    }
  };

  // Function to handle disabling input based on colored input
  const handleColoredChange = (selectedOption) => {
    setColored(selectedOption);

    if (selectedOption === "true") {
      setDisableInputSort(false); // Enable Players Sorting
    } else {
      setDisableInputSort(true); // Disable Players Sorting
      setSorting("none"); // Reset sorting when disabling
    }
  };

  // Function to handle disabling input based on stageOne input
  const handleStageChange = (selectedOption) => {
    setStageOne({
      ...stageOne,
      format: selectedOption,
    });

    if (
      selectedOption === "swiss" ||
      selectedOption === "round-robin" ||
      selectedOption === "double-round-robin"
    ) {
      setDisableInputStage(false); // Enable Players Stage Two format and advance setting
    } else {
      setDisableInputStage(true); // Disable Players Stage Two format and advance setting
      setStageTwo({
        format: "",
        advance: { method: "all", value: "" },
      });
    }
  };

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
      referee_id,
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
        advance: { method: "all", value: "" },
      });
      setRegister({
        open: format(new Date(), "yyyy-MM-dd"),
        close: format(addDays(new Date(), 20), "yyyy-MM-dd"),
      });
      setRunning({
        start: format(new Date(), "yyyy-MM-dd"),
        end: format(addDays(new Date(), 20), "yyyy-MM-dd"),
      });
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
      setSorting("none");
      setRefereeID(null);
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
    <div className="flex items-center justify-center my-20">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Create tournament</CardTitle>
          <CardDescription>
            Generate the tournament based on your imagination. Feel free to
            invite your friends or rivals for the epic fight.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  placeholder="e-Sukan di Universiti Malaysia"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="game_id">Game: </Label>
                <Select onValueChange={setGameid} value={game_id}>
                  <SelectTrigger className="border-gray-300 rounded-lg">
                    <SelectValue
                      placeholder="-- Choose --"
                      className="text-center"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {games &&
                        games.map((g) => (
                          <SelectItem key={g._id} value={g._id}>
                            {g.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="venue_id">Venue: </Label>
                <Select onValueChange={setVenueid} value={venue_id}>
                  <SelectTrigger className="border-gray-300 rounded-lg">
                    <SelectValue
                      placeholder="-- Choose --"
                      className="text-center"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {venues &&
                        venues.map((v) => (
                          <SelectItem key={v._id} value={v._id}>
                            {v.building}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h2>
                  <strong>Representative: </strong>
                </h2>

                <div className="flex">
                  <div className="w-1/2 pr-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="repType">Type: </Label>
                      <Select
                        onValueChange={(selectedOption) =>
                          handleRepresentativeChange(selectedOption)
                        }
                        value={representative.repType}
                      >
                        <SelectTrigger className="border-gray-300 rounded-lg">
                          <SelectValue
                            placeholder="-- Choose --"
                            className="text-center"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="team">Team</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="w-1/2">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="numPlayers">Number of players: </Label>
                      <Input
                        id="numPlayers"
                        type="number"
                        value={representative.numPlayers}
                        min="1"
                        placeholder="Eg: 2"
                        disabled={disableInput}
                        onChange={(e) =>
                          setRepresentative({
                            ...representative,
                            numPlayers: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div>
                  <h2>
                    <strong>Basic Configuration: </strong>
                  </h2>
                </div>

                <div>
                  <h3>
                    <strong>Order & Sorting: </strong>
                  </h3>

                  <div className="flex">
                    <div className="w-1/2 pr-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="colored">Players Order: </Label>
                        <Select
                          onValueChange={handleColoredChange}
                          value={colored}
                        >
                          <SelectTrigger className="border-gray-300 rounded-lg">
                            <SelectValue
                              placeholder="-- Choose --"
                              className="text-center"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="true">
                                Yes, it matters
                              </SelectItem>
                              <SelectItem value="false">
                                No, it can be random
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="w-1/2">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="sorting">Players Sorting: </Label>
                        <Select
                          onValueChange={setSorting}
                          value={sorting}
                          disabled={disableInputSort}
                        >
                          <SelectTrigger className="border-gray-300 rounded-lg">
                            <SelectValue
                              placeholder="-- Choose --"
                              className="text-center"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="ascending">
                                Ascending
                              </SelectItem>
                              <SelectItem value="descending">
                                Descending
                              </SelectItem>
                              <SelectItem value="none">
                                Not Applicable
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3>
                  <strong>Score Value: </strong>
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-4">
                    <Label htmlFor="win" className="w-1/3 text-left">
                      Win:{" "}
                    </Label>
                    <Input
                      id="win"
                      type="number"
                      value={scoring.win}
                      placeholder="Eg: 3"
                      onChange={(e) =>
                        setScoring({ ...scoring, win: e.target.value })
                      }
                      className="w-2/3"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <Label htmlFor="loss" className="w-1/3 text-left">
                      Loss:{" "}
                    </Label>
                    <Input
                      id="loss"
                      type="number"
                      value={scoring.loss}
                      placeholder="Eg: 0"
                      onChange={(e) =>
                        setScoring({ ...scoring, loss: e.target.value })
                      }
                      className="w-2/3"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <Label htmlFor="draw" className="w-1/3 text-left">
                      Draw:{" "}
                    </Label>
                    <Input
                      id="draw"
                      type="number"
                      value={scoring.draw}
                      placeholder="Eg: 1"
                      onChange={(e) =>
                        setScoring({ ...scoring, draw: e.target.value })
                      }
                      className="w-2/3"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <Label htmlFor="bye" className="w-1/3 text-left">
                      Bye:{" "}
                    </Label>
                    <Input
                      id="bye"
                      type="number"
                      value={scoring.bye}
                      placeholder="Eg: 3"
                      onChange={(e) =>
                        setScoring({ ...scoring, bye: e.target.value })
                      }
                      className="w-2/3"
                    />
                  </div>

                  <div className="flex items-center space-x-4 col-span-2 md:col-span-1">
                    <Label htmlFor="bestOf" className="w-1/3 text-left">
                      Best Of:{" "}
                    </Label>
                    <Input
                      id="bestOf"
                      type="number"
                      value={scoring.bestOf}
                      placeholder="Eg: 3"
                      onChange={(e) =>
                        setScoring({ ...scoring, bestOf: e.target.value })
                      }
                      className="w-2/3"
                    />
                  </div>
                </div>
              </div>

              {/* <div>
                <h3>
                  <strong>3rd Placement: </strong>
                </h3>

                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <div>
                      <Label htmlFor="tiebreaker">Tiebreaker Format: </Label>
                      <Select
                        onValueChange={(value) =>
                          setScoring({ ...scoring, tiebreaks: value })
                        }
                        value={scoring.tiebreaks}
                      >
                        <SelectTrigger className="border-gray-300 rounded-lg">
                          <SelectValue
                            placeholder="-- Choose --"
                            className="text-center"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="cumulative">
                              Cumulative
                            </SelectItem>
                            <SelectItem value="median buchholz">
                              Median Buchholz
                            </SelectItem>
                            <SelectItem value="opponent game win percentage">
                              Opponent Game Win Percentage
                            </SelectItem>
                            <SelectItem value="opponent match win percentage">
                              Opponent Match Win Percentage
                            </SelectItem>
                            <SelectItem value="opponent opponent match win percentage">
                              Opponent Opponent Match Win Percentage
                            </SelectItem>
                            <SelectItem value="solkoff">Solkoff</SelectItem>
                            <SelectItem value="sonneborn berger">
                              Sonneborn Berger
                            </SelectItem>
                            <SelectItem value="versus">Versus</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div> */}

              <div>
                <div>
                  <h2>
                    <strong>Stages</strong>
                  </h2>
                </div>

                <div>
                  <h3>
                    <strong>Stage One:</strong>
                  </h3>

                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <Label htmlFor="stageOneFormat">Format: </Label>
                      <Select
                        onValueChange={handleStageChange}
                        value={stageOne.format}
                      >
                        <SelectTrigger className="border-gray-300 rounded-lg">
                          <SelectValue
                            placeholder="-- Choose --"
                            className="text-center"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="single-elimination">
                              Single Elimination
                            </SelectItem>
                            <SelectItem value="double-elimination">
                              Double Elimination
                            </SelectItem>
                            {/* <SelectItem value="stepladder">
                              Stepladder
                            </SelectItem> */}
                            <SelectItem value="swiss">Swiss</SelectItem>
                            <SelectItem value="round-robin">
                              Round Robin
                            </SelectItem>
                            <SelectItem value="double-round-robin">
                              Double Round Robin
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-1/2">
                      <Label htmlFor="maxPlayers">Max Players: </Label>
                      <Input
                        id="maxPlayers"
                        type="number"
                        min="0"
                        placeholder="0 for no limit"
                        onChange={(e) =>
                          setStageOne({
                            ...stageOne,
                            maxPlayers: e.target.value,
                          })
                        }
                        value={stageOne.maxPlayers}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3>
                    <strong>Stage Two:</strong>
                  </h3>

                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="stageTwoFormat">Format: </Label>
                        <Select
                          onValueChange={(value) =>
                            setStageTwo({ ...stageTwo, format: value })
                          }
                          value={stageTwo.format}
                          disabled={disableInputStage}
                        >
                          <SelectTrigger className="border-gray-300 rounded-lg">
                            <SelectValue
                              placeholder="-- Choose --"
                              className="text-center"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="single-elimination">
                                Single Elimination
                              </SelectItem>
                              <SelectItem value="double-elimination">
                                Double Elimination
                              </SelectItem>
                              {/* <SelectItem value="stepladder">
                                Stepladder
                              </SelectItem> */}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="w-1/2 flex flex-col space-y-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="advanceMethod">Advance Method: </Label>
                        <Select
                          onValueChange={(value) =>
                            setStageTwo({
                              ...stageTwo,
                              advance: {
                                ...stageTwo.advance,
                                method: value,
                              },
                            })
                          }
                          value={stageTwo.advance.method}
                          disabled={disableInputStage}
                        >
                          <SelectTrigger className="border-gray-300 rounded-lg">
                            <SelectValue
                              placeholder="-- Choose --"
                              className="text-center"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="points">
                                Points (greater or equal)
                              </SelectItem>
                              <SelectItem value="rank">
                                Ranking (less or equal)
                              </SelectItem>
                              <SelectItem value="all">
                                Everyone Advance
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="advanceValue">Advance Value: </Label>
                        <Input
                          id="advanceValue"
                          type="number"
                          placeholder="Eg: 3"
                          min="0"
                          onChange={(e) =>
                            setStageTwo({
                              ...stageTwo,
                              advance: {
                                ...stageTwo.advance,
                                value: e.target.value,
                              },
                            })
                          }
                          value={stageTwo.advance.value}
                          disabled={disableInputStage}
                          className="border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2>
                  <strong>Referee</strong>
                </h2>

                <div className="w-1/2 flex flex-col space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="referee_id">Name: </Label>
                    <Select onValueChange={setRefereeID} value={referee_id}>
                      <SelectTrigger className="border-gray-300 rounded-lg">
                        <SelectValue
                          placeholder="-- Choose --"
                          className="text-center"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {users &&
                            users
                              .filter((user) => user.role === "referee")
                              .map((referee) => (
                                <SelectItem
                                  key={referee._id}
                                  value={referee._id}
                                >
                                  {referee.name}
                                </SelectItem>
                              ))}
                          <SelectItem value={null}>Not Applicable</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h2>
                  <strong>Date</strong>
                </h2>

                <div>
                  <Label htmlFor="registerDate">Registration: </Label>
                  <DatePickerWithRange
                    value={register}
                    onChange={setRegister}
                  />
                </div>

                <div className="w-full">
                  <Label htmlFor="runningDate">Running: </Label>
                  <DatePickerWithRange value={running} onChange={setRunning} />
                </div>

                <div>
                  <Label htmlFor="checkin" className="w-1/3 text-left">
                    Check In Time (minutes):{" "}
                  </Label>
                  <Input
                    id="checkin"
                    type="number"
                    min="1"
                    placeholder="Eg: 10"
                    onChange={(e) => setCheckin(e.target.value)}
                    value={checkin}
                    className="border border-gray-300 rounded p-2 w-1/4 mr-2"
                  ></Input>
                </div>
              </div>

              <div>
                <h2>
                  <strong>Notification</strong>
                </h2>

                <div>
                  <div>
                    <Label htmlFor="rules">Rules: </Label>
                    <Textarea
                      id="rules"
                      type="text"
                      placeholder="Tournament rules must be set so everyone can notice and remind themselves"
                      onChange={(e) =>
                        setNotification({
                          ...notification,
                          rules: e.target.value,
                        })
                      }
                    ></Textarea>
                  </div>
                  <div>
                    <Label htmlFor="regulation">Regulation: </Label>
                    <Textarea
                      id="regulation"
                      type="text"
                      placeholder="Tournament regulation must be mentioning about things that can control the situation"
                      onChange={(e) =>
                        setNotification({
                          ...notification,
                          regulation: e.target.value,
                        })
                      }
                    ></Textarea>
                  </div>
                </div>
              </div>

              <div>
                <h2>
                  <strong>Ticket Price</strong>
                </h2>

                <div className="flex">
                  <div className="w-1/2 pr-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="competitor">Competitor: </Label>
                      <Input
                        id="competitor"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="RM 5.50"
                        onChange={(e) =>
                          setTicket({ ...ticket, competitor: e.target.value })
                        }
                        value={ticket.competitor}
                      ></Input>
                    </div>
                  </div>

                  <div className="w-1/2 pr-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="viewer">Viewer: </Label>
                      <Input
                        id="viewer"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="RM 2.50"
                        onChange={(e) =>
                          setTicket({ ...ticket, viewer: e.target.value })
                        }
                        value={ticket.viewer}
                      ></Input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Button className="my-4 w-full">Submit</Button>
          </form>
          <BackButton className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" />
        </CardContent>
        <CardFooter>{error && <div className="error">{error}</div>}</CardFooter>
      </Card>
    </div>
  );
};

export default TournamentForm;
