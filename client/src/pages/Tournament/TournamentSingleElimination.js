import React, { useState, useEffect } from "react";
import {
  SingleEliminationBracket,
  Match,
  MATCH_STATES,
  SVGViewer,
} from "@g-loot/react-tournament-brackets";
import { useTournamentContext } from "src/hooks/useTournamentContext";
import { useUserContext } from "src/hooks/useUserContext";

function TournamentSingleElimination({id}) {
  const { tournaments } = useTournamentContext();
  const { users } = useUserContext();
  const [matches, setMatches] = useState([]);
  const [foundTournament, setfoundTournament] = useState(null);

  console.log(MATCH_STATES);

  useEffect(() => {
    setfoundTournament(tournaments.find((tournament) => tournament._id === id))

    if (foundTournament && foundTournament.setting && foundTournament.setting.matches) {
      const updatedMatches = foundTournament.setting.matches.map((m) => ({
        id: m.id,
        name:
            m.round === foundTournament.setting.stageOne.rounds
              ? "Final"
              : m.round ===
                (foundTournament.setting.stageOne.rounds - 1)
              ? `Semi Final - Match ${m.match}`
              : `Round ${m.round} - Match ${m.match}`,
        nextMatchId: m.path.win,
        nextLooserMatchId: m.path.loss,
        tournamentRoundText: `${m.round}`,
        startTime: "",
        state: m.active === true ? "PLAYED" : "PLANNED",
        participants: [
          {
            id: m.player1.id,
            resultText: m.player1.win,
            isWinner: m.player1.win > m.player1.loss,
            status: m.player1.id == null ? "NO_SHOW" : "PLAYED",
            name: users.find((user) => user._id === m.player1.id)?.name || "",
          },
          {
            id: m.player2.id,
            resultText: m.player2.win,
            isWinner: m.player2.win > m.player2.loss,
            status: m.player2.id == null ? "NO_SHOW" : "PLAYED",
            name: users.find((user) => user._id === m.player2.id)?.name || "",
          },
        ],
      }));

      setMatches(updatedMatches);
    }
  }, [id, tournaments, foundTournament, users]);

  return (
    <>
      <div>TournamentSingleElimination {id}</div>
      {foundTournament && foundTournament.setting.stageOne
        .format === "single-elimination" &&
        matches.length > 0 && (
          <SingleEliminationBracket
            matches={matches}
            matchComponent={Match}
            svgWrapper={({ children, ...props }) => (
              <SVGViewer width={1500} height={1000} {...props}>
                {children}
              </SVGViewer>
            )}
          />
        )}
    </>
  );
}

export default TournamentSingleElimination;
