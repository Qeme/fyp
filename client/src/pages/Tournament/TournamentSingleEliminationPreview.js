import React, { useState, useEffect } from "react";
import {
  SingleEliminationBracket,
  Match,
  createTheme,
  SVGViewer,
} from "@g-loot/react-tournament-brackets";
import { useTournamentContext } from "src/hooks/useTournamentContext";
import { useUserContext } from "src/hooks/useUserContext";

import { useAuthContext } from "src/hooks/useAuthContext";
import { useParams } from "react-router-dom";

function TournamentSingleEliminationPreview() {
  const { id } = useParams();
  const { tournaments } = useTournamentContext();
  const { users } = useUserContext();
  const { user } = useAuthContext();
  const [matches, setMatches] = useState({ upper: [], lower: [] });
  const [foundTournament, setfoundTournament] = useState(null);

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

    if (
      foundTournament &&
      foundTournament.setting &&
      foundTournament.setting.matches
    ) {
      const updatedMatches = foundTournament.setting.matches.map((m) => ({
        id: m.id,
        name:
          m.round === foundTournament.setting.stageOne.rounds
            ? "Final"
            : m.round === foundTournament.setting.stageOne.rounds - 1
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
  }, [id, tournaments, foundTournament, users, user.token]);

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
            foundTournament.setting.stageOne.format === "single-elimination" &&
            matches.length > 0 && (
              <SingleEliminationBracket
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
      </div>
    </main>
  );
}

export default TournamentSingleEliminationPreview;
