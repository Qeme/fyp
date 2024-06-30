import React, { useState } from "react";
import { useAuthContext } from "src/hooks/useAuthContext";
import { Button } from "src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/components/ui/dialog";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { useTournamentContext } from "src/hooks/useTournamentContext";
import { useGameContext } from "src/hooks/useGameContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { useVenueContext } from "src/hooks/useVenueContext";
import { Textarea } from "src/components/ui/textarea";
import { useUserContext } from "src/hooks/useUserContext";

export function TournamentEditTrigger({ tournament }) {
  const { dispatch } = useTournamentContext();
  const { games } = useGameContext();
  const { venues } = useVenueContext();
  const { users } = useUserContext();
  const { user } = useAuthContext();

  const [tournamentUpdated, setTournamentUpdated] = useState(tournament);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [disableInput, setDisableInput] = useState(true);

  const [disableInputSort, setDisableInputSort] = useState(true);
  const [disableInputStage, setDisableInputStage] = useState(true);

  // Function to handle changes in tournament.meta.representative.repType
  const handleRepresentativeChange = (selectedOption) => {
    setTournamentUpdated({
      ...tournamentUpdated,
      meta: {
        ...tournamentUpdated.meta,
        representative: {
          ...tournamentUpdated.meta.representative,
          repType: selectedOption,
        },
      },
    });

    // Handle disabling based on repType
    const disableInput =
      selectedOption === "individual" || selectedOption === "";
    setDisableInput(disableInput);

    // Reset numPlayers if switching to individual
    if (disableInput) {
      setTournamentUpdated((prevNum) => ({
        ...prevNum,
        meta: {
          ...prevNum.meta,
          representative: {
            ...prevNum.meta.representative,
            numPlayers: 1,
          },
        },
      }));
    }
  };

  // Function to handle disabling input based on tournament.setting.colored input
  const handleColoredChange = (selectedOption) => {
    setTournamentUpdated((prevColored) => ({
      ...prevColored,
      setting: {
        ...prevColored.setting,
        colored: selectedOption,
      },
    }));

    if (selectedOption) {
      setDisableInputSort(false); // Enable Players Sorting
    } else {
      setDisableInputSort(true); // Disable Players Sorting
      setTournamentUpdated((prevNum) => ({
        ...prevNum,
        setting: {
          ...prevNum.setting,
          sorting: "none",
        },
      })); // Reset sorting when disabling
    }
  };

  // Function to handle disabling input based on stageOne input
  const handleStageChange = (selectedOption) => {
    setTournamentUpdated({
      ...tournamentUpdated,
      setting: {
        ...tournamentUpdated.setting,
        stageOne: {
          ...tournamentUpdated.setting.stageOne,
          format: selectedOption,
        },
      },
    });

    if (
      selectedOption === "swiss" ||
      selectedOption === "round-robin" ||
      selectedOption === "double-round-robin"
    ) {
      setDisableInputStage(false); // Enable Players Stage Two format and advance setting
    } else {
      setDisableInputStage(true); // Disable Players Stage Two format and advance setting
      setTournamentUpdated((prevNum) => ({
        ...prevNum,
        setting: {
          ...prevNum.setting,
          stageTwo: {
            ...prevNum.setting.stageTwo,
            format: "",
            advance: { method: "all", value: "" },
          },
        },
      })); // Reset stageTwo when disabling
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    const response = await fetch(
      `http://localhost:3002/api/tournaments/${tournamentUpdated._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(tournamentUpdated),
      }
    );

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "UPDATE_TOURNAMENT", payload: json });
      setIsDialogOpen(false); // Close the dialog
    }
  };

  // Reset the form to the original tournament data
  const handleCancel = () => {
    // Reset to initial state
    setTournamentUpdated(tournament);
    // Close the dialog
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-blue-500 hover:bg-blue-800"
          onClick={() => setIsDialogOpen(true)}
        >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Tournament</DialogTitle>
          <DialogDescription>
            Make changes to the tournament here before publishing them. Click
            save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div>
          <div className="pt-6">
            <h3 className="text-left">
              <strong>Tournament Biodata</strong>
            </h3>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={tournamentUpdated.name}
                type="text"
                onChange={(e) =>
                  setTournamentUpdated({
                    ...tournamentUpdated,
                    name: e.target.value,
                  })
                }
                className="col-span-2"
              />
            </div>

            <div className="flex">
              <div className="w-1/2 pr-4">
                <div className="flex flex-col space-y-1.5 pt-2">
                  <Label htmlFor="game_id">Game: </Label>
                  <Select
                    onValueChange={(value) =>
                      setTournamentUpdated({
                        ...tournamentUpdated,
                        meta: {
                          ...tournamentUpdated.meta,
                          game_id: value,
                        },
                      })
                    }
                    value={tournamentUpdated.meta.game_id}
                  >
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
              </div>

              <div className="w-1/2">
                <div className="flex flex-col space-y-1.5 pt-2">
                  <Label htmlFor="venue_id">Venue: </Label>
                  <Select
                    onValueChange={(value) =>
                      setTournamentUpdated({
                        ...tournamentUpdated,
                        meta: {
                          ...tournamentUpdated.meta,
                          venue_id: value,
                        },
                      })
                    }
                    value={tournamentUpdated.meta.venue_id}
                  >
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
              </div>
            </div>
          </div>

          <div className="pt-8">
            <h3 className="text-left">
              <strong>Representative</strong>
            </h3>

            <div className="flex">
              <div className="w-1/2 pr-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="repType">Type: </Label>
                  <Select
                    onValueChange={(selectedOption) =>
                      handleRepresentativeChange(selectedOption)
                    }
                    value={tournamentUpdated.meta.representative.repType}
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
                    value={tournamentUpdated.meta.representative.numPlayers}
                    min="1"
                    placeholder="Eg: 2"
                    disabled={disableInput}
                    onChange={(e) =>
                      setTournamentUpdated({
                        ...tournamentUpdated,
                        meta: {
                          ...tournamentUpdated.meta,
                          representative: {
                            ...tournamentUpdated.meta.representative,
                            numPlayers: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="pt-8">
              <h3 className="text-left">
                <strong>Basic Configuration</strong>
              </h3>

              <div>
                <h4 className="text-left">
                  <strong>Order & Sorting</strong>
                </h4>

                <div className="flex">
                  <div className="w-1/2 pr-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="colored">Players Order: </Label>
                      <Select
                        onValueChange={handleColoredChange}
                        value={tournamentUpdated.setting.colored}
                      >
                        <SelectTrigger className="border-gray-300 rounded-lg">
                          <SelectValue
                            placeholder="-- Choose --"
                            className="text-center"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value={true}>
                              Yes, it matters
                            </SelectItem>
                            <SelectItem value={false}>
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
                        onValueChange={(value) =>
                          setTournamentUpdated({
                            ...tournamentUpdated,
                            setting: {
                              ...tournamentUpdated.setting,
                              sorting: value,
                            },
                          })
                        }
                        value={tournamentUpdated.setting.sorting}
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
                            <SelectItem value="none">Not Applicable</SelectItem>
                            <SelectItem value="ascending">Ascending</SelectItem>
                            <SelectItem value="descending">
                              Descending
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="text-left">
                  <strong>Scoring</strong>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-4">
                    <Label htmlFor="win" className="w-1/3 text-left">
                      Win:{" "}
                    </Label>
                    <Input
                      id="win"
                      type="number"
                      value={tournamentUpdated.setting.scoring.win}
                      placeholder="Eg: 3"
                      onChange={(e) =>
                        setTournamentUpdated({
                          ...tournamentUpdated,
                          setting: {
                            ...tournamentUpdated.setting,
                            scoring: {
                              ...tournamentUpdated.setting.scoring,
                              win: e.target.value,
                            },
                          },
                        })
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
                      value={tournamentUpdated.setting.scoring.loss}
                      placeholder="Eg: 0"
                      onChange={(e) =>
                        setTournamentUpdated({
                          ...tournamentUpdated,
                          setting: {
                            ...tournamentUpdated.setting,
                            scoring: {
                              ...tournamentUpdated.setting.scoring,
                              loss: e.target.value,
                            },
                          },
                        })
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
                      value={tournamentUpdated.setting.scoring.draw}
                      placeholder="Eg: 1"
                      onChange={(e) =>
                        setTournamentUpdated({
                          ...tournamentUpdated,
                          setting: {
                            ...tournamentUpdated.setting,
                            scoring: {
                              ...tournamentUpdated.setting.scoring,
                              draw: e.target.value,
                            },
                          },
                        })
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
                      value={tournamentUpdated.setting.scoring.bye}
                      placeholder="Eg: 3"
                      onChange={(e) =>
                        setTournamentUpdated({
                          ...tournamentUpdated,
                          setting: {
                            ...tournamentUpdated.setting,
                            scoring: {
                              ...tournamentUpdated.setting.scoring,
                              bye: e.target.value,
                            },
                          },
                        })
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
                      value={tournamentUpdated.setting.scoring.bestOf}
                      placeholder="Eg: 3"
                      onChange={(e) =>
                        setTournamentUpdated({
                          ...tournamentUpdated,
                          setting: {
                            ...tournamentUpdated.setting,
                            scoring: {
                              ...tournamentUpdated.setting.scoring,
                              bestOf: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-2/3"
                    />
                  </div>
                </div>
              </div>

              {/* <div className="pt-4">
                <h4 className="text-left">
                  <strong>3rd Placement</strong>
                </h4>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <div>
                      <Label htmlFor="tiebreaker">Tiebreaker Format: </Label>
                      <Select
                        onValueChange={(value) =>
                          setTournamentUpdated({
                            ...tournamentUpdated,
                            setting: {
                              ...tournamentUpdated.setting,
                              scoring: {
                                ...tournamentUpdated.setting.scoring,
                                tiebreaks: [value], //take the value as an array because we set up as an array
                              },
                            },
                          })
                        }
                        value={tournamentUpdated.setting.scoring.tiebreaks?.[0]}
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
            </div>
          </div>

          <div>
            <div className="pt-8">
              <h3 className="text-left">
                <strong>Stages</strong>
              </h3>

              <div>
                <h4 className="text-left">
                  <strong>Stage One</strong>
                </h4>

                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <Label htmlFor="stageOneFormat">Format: </Label>
                    <Select
                      onValueChange={handleStageChange}
                      value={tournamentUpdated.setting.stageOne.format}
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
                          {/* <SelectItem value="stepladder">Stepladder</SelectItem> */}
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
                        setTournamentUpdated({
                          ...tournamentUpdated,
                          setting: {
                            ...tournamentUpdated.setting,
                            stageOne: {
                              ...tournamentUpdated.setting.stageOne,
                              maxPlayers: e.target.value,
                            },
                          },
                        })
                      }
                      value={tournamentUpdated.setting.stageOne.maxPlayers}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="pt-4">
                  <h4 className="text-left">
                    <strong>Stage Two</strong>
                  </h4>

                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="stageTwoFormat">Format: </Label>
                        <Select
                          onValueChange={(value) =>
                            setTournamentUpdated({
                              ...tournamentUpdated,
                              setting: {
                                ...tournamentUpdated.setting,
                                stageTwo: {
                                  ...tournamentUpdated.setting.stageTwo,
                                  format: value,
                                },
                              },
                            })
                          }
                          value={tournamentUpdated.setting.stageTwo.format}
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
                            setTournamentUpdated({
                              ...tournamentUpdated,
                              setting: {
                                ...tournamentUpdated.setting,
                                stageTwo: {
                                  ...tournamentUpdated.setting.stageTwo,
                                  advance: {
                                    ...tournamentUpdated.setting.stageTwo
                                      .advance,
                                    method: value,
                                  },
                                },
                              },
                            })
                          }
                          value={
                            tournamentUpdated.setting.stageTwo.advance.method
                          }
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
                            setTournamentUpdated({
                              ...tournamentUpdated,
                              setting: {
                                ...tournamentUpdated.setting,
                                stageTwo: {
                                  ...tournamentUpdated.setting.stageTwo,
                                  advance: {
                                    ...tournamentUpdated.setting.stageTwo
                                      .advance,
                                    value: e.target.value,
                                  },
                                },
                              },
                            })
                          }
                          value={
                            tournamentUpdated.setting.stageTwo.advance.value
                          }
                          disabled={disableInputStage}
                          className="border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="pt-8">
              <h3 className="text-left">
                <strong>Referee</strong>
              </h3>

              <div className="w-1/2 flex flex-col space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="advanceMethod">Name: </Label>
                  <Select
                    onValueChange={(value) =>
                      setTournamentUpdated({
                        ...tournamentUpdated,
                        meta: {
                          ...tournamentUpdated.meta,
                          referee_id: value,
                        },
                      })
                    }
                    value={tournamentUpdated.meta.referee_id}
                  >
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
                              <SelectItem key={referee._id} value={referee._id}>
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
          </div>

          <div className="pt-8">
            <h3 className="text-left">
              <strong>Notification</strong>
            </h3>

            <div>
              <Label htmlFor="rules">Rules: </Label>
              <Textarea
                id="rules"
                type="text"
                placeholder="Tournament rules must be set so everyone can notice and remind themselves"
                onChange={(e) =>
                  setTournamentUpdated({
                    ...tournamentUpdated,
                    meta: {
                      ...tournamentUpdated.meta,
                      notification: {
                        ...tournamentUpdated.meta.notification,
                        rules: e.target.value,
                      },
                    },
                  })
                }
                value={tournamentUpdated.meta.notification.rules}
              ></Textarea>
            </div>

            <div>
              <Label htmlFor="regulation">Regulation: </Label>
              <Textarea
                id="regulation"
                type="text"
                placeholder="Tournament regulation must be mentioning about things that can control the situation"
                onChange={(e) =>
                  setTournamentUpdated({
                    ...tournamentUpdated,
                    meta: {
                      ...tournamentUpdated.meta,
                      notification: {
                        ...tournamentUpdated.meta.notification,
                        regulation: e.target.value,
                      },
                    },
                  })
                }
                value={tournamentUpdated.meta.notification.regulation}
              ></Textarea>
            </div>
          </div>

          <div className="pt-8">
            <h3 className="text-left">
              <strong>Ticket Price</strong>
            </h3>

            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Label htmlFor="competitor">Competitor: RM</Label>
                <Input
                  id="competitor"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="RM 12.50"
                  onChange={(e) =>
                    setTournamentUpdated({
                      ...tournamentUpdated,
                      meta: {
                        ...tournamentUpdated.meta,
                        ticket: {
                          ...tournamentUpdated.meta.ticket,
                          competitor: e.target.value,
                        },
                      },
                    })
                  }
                  value={tournamentUpdated.meta.ticket.competitor.toFixed(2)}
                  className="w-40"
                ></Input>
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="viewer">Viewer: RM</Label>
                <Input
                  id="viewer"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="RM 11.00"
                  onChange={(e) =>
                    setTournamentUpdated({
                      ...tournamentUpdated,
                      meta: {
                        ...tournamentUpdated.meta,
                        ticket: {
                          ...tournamentUpdated.meta.ticket,
                          viewer: e.target.value,
                        },
                      },
                    })
                  }
                  value={tournamentUpdated.meta.ticket.viewer.toFixed(2)}
                  className="w-40"
                ></Input>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleClick} type="button" className="ml-2">
              Save changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
