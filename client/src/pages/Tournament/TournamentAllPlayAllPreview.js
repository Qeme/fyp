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

import { ScrollArea } from "src/components/ui/scroll-area";
import { useParams } from "react-router-dom";

function TournamentAllPlayAllPreview() {
  const { id } = useParams();
  const { tournaments } = useTournamentContext();
  const { users } = useUserContext();
  const { user } = useAuthContext();
  const [foundTournament, setFoundTournament] = useState(null);

  const [ranking, setRanking] = useState(null);
  const [matchesByRound, setMatchesByRound] = useState([]);

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        const tournament = tournaments.find(
          (tournament) => tournament._id === id
        );
        console.log("HEH", tournament);
        if (!tournament) {
          throw new Error("Tournament not found");
        }

        setFoundTournament(tournament);

        // Fetch ranking list
        const fetchRanking = async () => {
          try {
            const response = await fetch(
              `http://localhost:3002/api/tournaments/standing/${tournament._id}`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            );
            if (!response.ok) {
              throw new Error("Failed to fetch ranking");
            }
            const json = await response.json();
            // Assign ordinal ranks
            json.forEach((rank, index) => {
              rank.ordinal = getOrdinal(index + 1);
            });
            setRanking(json);
          } catch (error) {
            console.error("Error fetching ranking:", error);
            // Handle error state or retry logic here
          }
        };

        // Organize matches by rounds
        const roundsArray = Array.from(
          { length: tournament.setting.stageOne.rounds },
          () => []
        );

        tournament.setting.matches
          .filter((match) => match.round <= tournament.setting.stageOne.rounds)
          .forEach((match) => {
            if (match.round) {
              roundsArray[match.round - 1].push(match);
            }
          });

        await fetchRanking();
        setMatchesByRound(roundsArray);
      } catch (error) {
        console.error("Error fetching tournament data:", error);
        // Handle error state or retry logic here
      }
    };

    fetchTournamentData();
  }, [id, tournaments, user.token]);

  // Function to get ordinal suffix for ranking
  const getOrdinal = (position) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = position % 100;
    return position + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  };

  return (
    <main>
      <div className="text-center p-4 my-4">
        <span className="uppercase text-3xl font-semibold font-serif">
          {foundTournament && foundTournament.setting.stageOne.format}
        </span>
      </div>
      <div className="flex justify-stretch space-x-12 p-2">
        <ScrollArea className="max-h-[600px] w-3/5">
          <div>
            {foundTournament &&
              matchesByRound.map((roundMatches, roundIndex) => (
                <div key={roundIndex}>
                  <h3 className="text-gray-500">Round {roundIndex + 1}</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20 bg-gray-300">
                          Match#
                        </TableHead>
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
                              users.find(
                                (user) => user._id === match.player1.id
                              )?.name}
                          </TableCell>
                          <TableCell>
                            {users &&
                              users.find(
                                (user) => user._id === match.player2.id
                              )?.name}
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
        </ScrollArea>

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
                          ? "bg-amber-600"
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
    </main>
  );
}

export default TournamentAllPlayAllPreview;
