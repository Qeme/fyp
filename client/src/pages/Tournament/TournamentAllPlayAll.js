import { useAuthContext } from "src/hooks/useAuthContext";
import React, { useState, useEffect } from "react";
import { useTournamentContext } from "src/hooks/useTournamentContext";
import { useUserContext } from "src/hooks/useUserContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
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
import { ScrollArea } from "src/components/ui/scroll-area";
import { useRoundContext } from "src/hooks/useRoundContext";
import { Input } from "src/components/ui/input";

function TournamentAllPlayAll({ id }) {
  const { tournaments } = useTournamentContext();
  const { rounds } = useRoundContext();
  const { users } = useUserContext();
  const { user } = useAuthContext();
  const [foundTournament, setFoundTournament] = useState(null);
  const [round, setRounds] = useState(null);
  const [matchNum, setMatchNum] = useState("");
  const [ranking, setRanking] = useState(null);
  const [matchesByRound, setMatchesByRound] = useState([]);
  const [roundGame, setRoundGame] = useState("");
  const [scoresP1, setScoresP1] = useState([]);
  const [scoresP2, setScoresP2] = useState([]);

  useEffect(() => {
    const tournament = tournaments.find((tournament) => tournament._id === id);

    if (tournament) {
      setFoundTournament(tournament);
      setRounds(tournament.setting.stageOne.rounds);

      // Get the ranking list
      const fetchRanking = async () => {
        const response = await fetch(
          `http://localhost:3002/api/tournaments/standing/${tournament._id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const json = await response.json();

        if (response.ok) {
          // Assign ordinal ranks
          json.forEach((rank, index) => {
            rank.ordinal = getOrdinal(index + 1);
          });
          setRanking(json);
        }
      };

      // Organize matches by rounds
      const roundsArray = Array.from(
        { length: tournament.setting.stageOne.rounds },
        () => []
      );
      tournament.setting.matches.forEach((match) => {
        if (match.round) {
          roundsArray[match.round - 1].push(match);
        }
      });

      fetchRanking();
      setMatchesByRound(roundsArray);
    }
  }, [id, tournaments, user, users]);

  // Function to get ordinal suffix for ranking
  const getOrdinal = (position) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = position % 100;
    return position + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const match = foundTournament.setting.matches.find(
      (match) => match.id === matchNum
    );

    console.log("Selected match:", match.id);
    if (match) {
      const foundGame =
        rounds && rounds.find((round) => round.match_id === match.id);
      setRoundGame(foundGame);
      setScoresP1(foundGame?.scoreP1 || []);
      setScoresP2(foundGame?.scoreP2 || []);
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
    console.log("Updated Scores P1:", scoresP1);
    console.log("Updated Scores P2:", scoresP2);
  };

  const handleResetScores = () => {
    if (roundGame) {
      setScoresP1(roundGame.scoreP1 || []);
      setScoresP2(roundGame.scoreP2 || []);
    }
  };

  return (
    <main>
      <div>TournamentAllPlayAll {id}</div>
      <div className="flex justify-between space-x-12 p-2">
        <div className="w-3/5">
          {foundTournament &&
            matchesByRound.map((roundMatches, roundIndex) => (
              <div key={roundIndex}>
                <h3 className="text-gray-500">Round {roundIndex + 1}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20 bg-gray-300">Match#</TableHead>
                      <TableHead className=" bg-gray-300">P1</TableHead>
                      <TableHead className=" bg-gray-300">P2</TableHead>
                      <TableHead className="text-center w-24 bg-gray-300">
                        P1 Wins
                      </TableHead>
                      <TableHead className="text-center w-24  bg-gray-300">
                        P2 Wins
                      </TableHead>
                      <TableHead className="text-center w-24  bg-gray-300">
                        Draw
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roundMatches.map((match) => (
                      <TableRow key={match.id}>
                        <TableCell className="w-20 text-center">
                          {match.match}
                        </TableCell>
                        <TableCell>
                          {users &&
                            users.find((user) => user._id === match.player1.id)
                              ?.name}
                        </TableCell>
                        <TableCell>
                          {users &&
                            users.find((user) => user._id === match.player2.id)
                              ?.name}
                        </TableCell>
                        <TableCell className="text-center w-24 bg-gray-200">
                          {match.player1.win}
                        </TableCell>
                        <TableCell className="text-center w-24 bg-gray-200">
                          {match.player2.win}
                        </TableCell>
                        <TableCell className="text-center w-24 bg-gray-200">
                          {match.player1.draw}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
        </div>

        <div className="w-2/5">
          {ranking && (
            <>
              <h3>Ranking</h3>
              <Table>
                <ScrollArea className="h-50">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank #</TableHead>
                      <TableHead>Player Name</TableHead>
                      <TableHead>Total Matches</TableHead>
                      <TableHead>Played Matches</TableHead>
                      <TableHead>Game Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ranking.map((rank) => {
                      const bgColor =
                        rank.ordinal === "1st"
                          ? "bg-yellow-500"
                          : rank.ordinal === "2nd"
                          ? "bg-gray-400"
                          : rank.ordinal === "3rd"
                          ? "bg-amber-700"
                          : "bg-gray-200";

                      return (
                        <TableRow key={rank.player.id} className={bgColor}>
                          <TableCell>{rank.ordinal}</TableCell>
                          <TableCell>{rank.player.name}</TableCell>
                          <TableCell>
                            {foundTournament.setting.stageOne.rounds}
                          </TableCell>
                          <TableCell>{rank.matches}</TableCell>
                          <TableCell>{rank.gamePoints}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </ScrollArea>
              </Table>
            </>
          )}
        </div>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Updating matches</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="matchNum">Select Match: </Label>
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
                            Round {match.round} - Match {match.match}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div>
                  <Button type="submit">Search</Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setMatchNum("");
                      setRoundGame("")
                      setScoresP1([])
                      setScoresP2([])
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>

            {roundGame && (
              <form onSubmit={handleScoreSubmit}>
                <h4>Score Details</h4>
                <div>
                  <Label htmlFor="scoreP1">
                    {users.find((user) => user._id === roundGame.p1)?.name}{" "}
                    Scores
                  </Label>
                  {scoresP1.map((score, index) => (
                    <Input
                      key={index}
                      type="number"
                      value={score}
                      onChange={(e) =>
                        handleP1ScoreChange(index, e.target.value)
                      }
                      className="border rounded p-1 mb-2"
                    />
                  ))}
                </div>
                <div>
                  <Label htmlFor="scoreP2">
                    {users.find((user) => user._id === roundGame.p2)?.name}{" "}
                    Scores
                  </Label>
                  {scoresP2.map((score, index) => (
                    <Input
                      key={index}
                      type="number"
                      value={score}
                      onChange={(e) =>
                        handleP2ScoreChange(index, e.target.value)
                      }
                      className="border rounded p-1 mb-2"
                    />
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="submit"
                  >
                    Update Scores
                  </Button>
                  <Button
                    type="button"
                    onClick={handleResetScores}
                  >
                    Reset Scores
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default TournamentAllPlayAll;
