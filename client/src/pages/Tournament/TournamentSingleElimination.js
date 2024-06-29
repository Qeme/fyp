import React, { useState, useEffect } from "react";
import {
  SingleEliminationBracket,
  Match,
  MATCH_STATES,
  createTheme,
  SVGViewer,
} from "@g-loot/react-tournament-brackets";
import { useTournamentContext } from "src/hooks/useTournamentContext";
import { useUserContext } from "src/hooks/useUserContext";

function TournamentSingleElimination({id}) {
  const { tournaments } = useTournamentContext();
  const { users } = useUserContext();
  const [matches, setMatches] = useState([]);
  const [foundTournament, setfoundTournament] = useState(null);

  const BracketTheme = createTheme({
    textColor: { main: "#000000", highlighted: "#07090D", dark: "#3E414D" },
    matchBackground: { wonColor: "#5C88C4", lostColor: "#9B86BD" },
    score: {
      background: { wonColor: "#83B4FF", lostColor: "#E2BBE9" },
      text: { highlightedWonColor: "#0A6847", highlightedLostColor: "#C73659" },
    },
    border: {
      color: "#98ABEE",
      highlightedColor: "#535C91",
    },
    roundHeaders: { backgroundColor: "#5755FE", fontColor: "#FFAF45" },
    connectorColor: "#CED1F2",
    connectorColorHighlight: "#12486B",
    svgBackground: "#9BB8CD",
  });

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

      setMatches(updatedMatches);
    }
  }, [id, tournaments, foundTournament, users]);

  return (
    <main>
      <div>TournamentSingleElimination {id}</div>
      {foundTournament && foundTournament.setting.stageOne
        .format === "single-elimination" &&
        matches.length > 0 && (
          <SingleEliminationBracket
            matches={matches}
            matchComponent={Match}
            theme={BracketTheme}
            options={{
              style: {
                roundHeader: {
                  backgroundColor: BracketTheme.roundHeaders.backgroundColor,
                  fontColor: BracketTheme.roundHeaders.fontColor,
                },
                connectorColor: BracketTheme.connectorColor,
                connectorColorHighlight: BracketTheme.connectorColorHighlight,
              },
            }}
            svgWrapper={({ children, ...props }) => (
              <SVGViewer width={800} height={600} background={BracketTheme.svgBackground} SVGBackground={BracketTheme.svgBackground} {...props}>
                {children}
              </SVGViewer>
            )}
          />
        )}
    </main>
  );
}

export default TournamentSingleElimination;
