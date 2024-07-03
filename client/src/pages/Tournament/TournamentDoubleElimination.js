import React, { useState, useEffect } from "react";
import {
  DoubleEliminationBracket,
  Match,
  SVGViewer,
  createTheme,
} from "@g-loot/react-tournament-brackets";
import { useTournamentContext } from "src/hooks/useTournamentContext";
import { useUserContext } from "src/hooks/useUserContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Label } from "src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { useAuthContext } from "src/hooks/useAuthContext";

function TournamentDoubleElimination({ id }) {
  const { dispatch, tournaments } = useTournamentContext();
  const { users } = useUserContext();
  const { user } = useAuthContext();
  const [matches, setMatches] = useState({ upper: [], lower: [] });
  const [foundTournament, setfoundTournament] = useState(null);
  const [rounds, setRounds] = useState("");
  const [matchNum, setMatchNum] = useState("");
  const [roundGame, setRoundGame] = useState("");
  const [scoresP1, setScoresP1] = useState([]);
  const [scoresP2, setScoresP2] = useState([]);
  const [error, setError] = useState("");

  const BracketTheme = createTheme({
    textColor: { main: "#000000", highlighted: "#07090D", dark: "#3E414D" },
    matchBackground: { wonColor: "#DC5F00", lostColor: "#686D76" },
    score: {
      background: { wonColor: "#FF7D29", lostColor: "#9BB0C1" },
      text: { highlightedWonColor: "#000000", highlightedLostColor: "#000000" },
    },
    border: {
      color: "#373A40",
      highlightedColor: "#EEEEEE",
    },
    roundHeaders: { backgroundColor: "#5755FE", fontColor: "#FFAF45" },
    connectorColor: "#070F2B",
    connectorColorHighlight: "#EEEEEE",
    svgBackground: "#C9D7DD",
  });

  useEffect(() => {
    const tournament = tournaments.find((tournament) => tournament._id === id);
    setfoundTournament(tournament);

    if (tournament && tournament.setting && tournament.setting.matches) {
      const upperMatches = tournament.setting.matches
        .filter(
          (m) => m.round <= Math.ceil(tournament.setting.stageOne.rounds / 2)
        )
        .map((m) => ({
          id: m.id,
          name:
            m.round === Math.ceil(tournament.setting.stageOne.rounds / 2)
              ? "Final"
              : m.round ===
                Math.ceil(tournament.setting.stageOne.rounds / 2) - 1
              ? "UB Semi Final"
              : `UB ${m.round}.${m.match}`,
          nextMatchId: m.path.win,
          nextLooserMatchId: m.path.loss,
          tournamentRoundText: `UB ${m.round}`,
          startTime: "",
          state: m.active === true ? "PLAYED" : "PLANNED",
          participants: [m.player1, m.player2]
            .filter((player) => player.id !== null)
            .map((player) => ({
              id: player.id,
              resultText: player.win,
              isWinner: player.win > player.loss,
              status: "PLAYED",
              name: users.find((user) => user._id === player.id)?.name || "",
            })),
        }));

      const lowerMatches = tournament.setting.matches
        .filter(
          (m) => m.round > Math.ceil(tournament.setting.stageOne.rounds / 2)
        )
        .map((m) => ({
          id: m.id,
          name:
            m.round === tournament.setting.stageOne.rounds
              ? "LB Semi Final"
              : `LB ${
                  m.round - Math.ceil(tournament.setting.stageOne.rounds / 2)
                }.${m.match}`,
          nextMatchId: m.path.win,
          nextLooserMatchId: m.path.loss,
          tournamentRoundText: `LB ${
            m.round - Math.ceil(tournament.setting.stageOne.rounds / 2)
          }`,
          startTime: "",
          state: m.active === true ? "PLAYED" : "PLANNED",
          participants: [m.player1, m.player2]
            .filter((player) => player.id !== null)
            .map((player) => ({
              id: player.id,
              resultText: player.win,
              isWinner: player.win > player.loss,
              status: "PLAYED",
              name: users.find((user) => user._id === player.id)?.name || "",
            })),
        }));

      setMatches({ upper: upperMatches, lower: lowerMatches });
    }

    // Fetch rounds related to the tournament
    const fetchRounds = async () => {
      try {
        const response = await fetch(
          `http://localhost:3002/api/rounds/stageone/${tournament._id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch rounds");
        }
        const json = await response.json();
        setRounds(json);
      } catch (error) {
        console.error("Error fetching rounds:", error);
        // Handle error state or retry logic here
      }
    };

    fetchRounds();
  }, [id, tournaments, users, user.token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const match = foundTournament.setting.matches.find(
      (match) => match.id === matchNum
    );

    console.log("Selected match:", match.id);
    if (match) {
      const foundGame =
        rounds && rounds.find((round) => round.match_id === match.id);
      console.log(foundGame);
      if (foundGame) {
        setRoundGame(foundGame);
        setScoresP1(foundGame?.scoreP1 || []);
        setScoresP2(foundGame?.scoreP2 || []);
      } else {
        setRoundGame({
          match_id: match.id,
          bestOf: foundTournament.setting.scoring.bestOf,
          p1: match.player1.id,
          p2: match.player2.id,
          status: "unlocked",
        });

        const initialScores = Array.from(
          { length: foundTournament.setting.scoring.bestOf },
          () => 0
        );
        setScoresP1(initialScores);
        setScoresP2(initialScores);
      }

      console.log(roundGame);
    } else {
      console.log("Match not found");
    }
  };

  const handleP1ScoreChange = (index, value) => {
    const newScores = [...scoresP1];
    newScores[index] = value;
    setScoresP1(newScores);
  };

  const handleP2ScoreChange = (index, value) => {
    const newScores = [...scoresP2];
    newScores[index] = value;
    setScoresP2(newScores);
  };

  const handleScoreSubmit = async (event) => {
    event.preventDefault();

    // Submit updated scores to the server or handle them as needed
    console.log("Round:", roundGame);
    console.log("Updated Scores P1:", scoresP1);
    console.log("Updated Scores P2:", scoresP2);

    const response = await fetch(
      `http://localhost:3002/api/rounds/${id}/${roundGame.match_id}`,
      {
        method: "POST",
        body: JSON.stringify({
          p1score: scoresP1,
          p2score: scoresP2,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "UPDATE_TOURNAMENT", payload: json });
      await fetchRoundsAndUpdateForm();
    } else if (!response.ok) {
      setError(json.error);
    }
  };

  const handleResetScores = () => {
    if (roundGame) {
      setScoresP1(roundGame.scoreP1 || []);
      setScoresP2(roundGame.scoreP2 || []);
    }
  };

  const handleClearScores = async (match_id) => {
    console.log("WOW", match_id);

    const response = await fetch(
      `http://localhost:3002/api/rounds/${id}/${match_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "UPDATE_TOURNAMENT", payload: json });
      await fetchRoundsAndUpdateForm();
    }
  };

  const fetchRoundsAndUpdateForm = async () => {
    const response = await fetch(
      `http://localhost:3002/api/rounds/stageone/${foundTournament._id}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const json = await response.json();

    if (response.ok) {
      setRounds(json);

      const match = foundTournament.setting.matches.find(
        (match) => match.id === matchNum
      );

      if (match) {
        const foundGame =
          json && json.find((round) => round.match_id === match.id);
        setRoundGame(foundGame);
        setScoresP1(foundGame?.scoreP1 || []);
        setScoresP2(foundGame?.scoreP2 || []);
      }
    }
  };

  return (
    <main>
      <div className="text-center p-4 my-4">
        <span className="uppercase text-3xl font-semibold font-serif">
          {foundTournament && foundTournament.setting.stageOne.format}
        </span>
      </div>
      <div className="flex justify-center space-x-6">
        <div>
          {foundTournament &&
            foundTournament.setting.stageOne.format === "double-elimination" &&
            matches.upper.length > 0 &&
            matches.lower.length > 0 && (
              <DoubleEliminationBracket
                matches={matches}
                matchComponent={Match}
                theme={BracketTheme}
                options={{
                  style: {
                    roundHeader: {
                      backgroundColor:
                        BracketTheme.roundHeaders.backgroundColor,
                      fontColor: BracketTheme.roundHeaders.fontColor,
                    },
                    connectorColor: BracketTheme.connectorColor,
                    connectorColorHighlight:
                      BracketTheme.connectorColorHighlight,
                  },
                }}
                svgWrapper={({ children, ...props }) => (
                  <SVGViewer
                    width={800}
                    height={600}
                    background={BracketTheme.svgBackground}
                    SVGBackground={BracketTheme.svgBackground}
                    {...props}
                  >
                    {children}
                  </SVGViewer>
                )}
              />
            )}
        </div>
        <div className="flex align-middle shadow-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Updating Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="matchNum">
                    <h4>Select Match</h4>
                  </Label>
                  <Select onValueChange={setMatchNum} value={matchNum}>
                    <SelectTrigger className="border-gray-300 rounded-lg">
                      <SelectValue
                        placeholder="-- Choose --"
                        className="text-center"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {foundTournament &&
                          foundTournament.setting.matches.map((match) => (
                            <SelectItem key={match.id} value={match.id}>
                              {match.round ===
                              Math.ceil(
                                foundTournament.setting.stageOne.rounds / 2
                              ) ? (
                                "Final"
                              ) : match.round ===
                                Math.ceil(
                                  foundTournament.setting.stageOne.rounds / 2
                                ) -
                                  1 ? (
                                "UB Semi Final"
                              ) : match.round ===
                                foundTournament.setting.stageOne.rounds ? (
                                "LB Semi Final"
                              ) : match.round <=
                                Math.ceil(
                                  foundTournament.setting.stageOne.rounds / 2
                                ) ? (
                                `UB ${match.round}.${match.match}`
                              ) : match.round >
                                Math.ceil(
                                  foundTournament.setting.stageOne.rounds / 2
                                ) ? (
                                `LB ${
                                  match.round -
                                  Math.ceil(
                                    foundTournament.setting.stageOne.rounds / 2
                                  )
                                }.${match.match}`
                              ) : (
                                <>
                                  Round {match.round} - Match {match.match}
                                </>
                              )}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div className="flex justify-center">
                    <div className="flex space-x-2">
                      <Button type="submit">Search</Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setMatchNum("");
                          setRoundGame("");
                          setScoresP1([]);
                          setScoresP2([]);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </form>

              {roundGame && (
                <div className="py-8">
                  <form onSubmit={handleScoreSubmit}>
                    <h4>Score Details</h4>
                    <div className="flex justify-center space-x-14">
                      <div className="w-1/3 text-center">
                        <Label htmlFor="scoreP1">
                          {
                            users.find((user) => user._id === roundGame.p1)
                              ?.name
                          }
                        </Label>
                        {scoresP1.map((score, index) => (
                          <Input
                            key={index}
                            type="number"
                            min="0"
                            value={score}
                            onChange={(e) =>
                              handleP1ScoreChange(index, e.target.value)
                            }
                            className="border rounded p-1 mb-2"
                          />
                        ))}
                      </div>
                      <div className="w-1/3 text-center">
                        <Label htmlFor="scoreP2">
                          {
                            users.find((user) => user._id === roundGame.p2)
                              ?.name
                          }
                        </Label>
                        {scoresP2.map((score, index) => (
                          <Input
                            key={index}
                            type="number"
                            min="0"
                            value={score}
                            onChange={(e) =>
                              handleP2ScoreChange(index, e.target.value)
                            }
                            className="border rounded p-1 mb-2"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-center my-8">
                      <div className="flex space-x-2">
                        <Button type="submit">Update Scores</Button>
                        <Button type="button" onClick={handleResetScores}>
                          Reset Scores
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            handleClearScores(roundGame.match_id);
                          }}
                        >
                          Clear Score
                        </Button>
                      </div>
                    </div>
                    {error && <div className="text-red-500">{error}</div>}
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default TournamentDoubleElimination;
