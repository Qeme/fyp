import React, { useState, useEffect } from "react";
import {
  DoubleEliminationBracket,
  Match,
  SVGViewer,
  createTheme,
} from "@g-loot/react-tournament-brackets";
import { useTournamentContext } from "src/hooks/useTournamentContext";
import { useUserContext } from "src/hooks/useUserContext";

function TournamentDoubleElimination({ id }) {
  const { tournaments } = useTournamentContext();
  const { users } = useUserContext();
  const [matches, setMatches] = useState({ upper: [], lower: [] });
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
  }, [id, tournaments, users]);

  return (
    <main>
      <div>TournamentDoubleElimination {id}</div>
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
      <p>hi</p>
    </main>
  );
}

export default TournamentDoubleElimination;
