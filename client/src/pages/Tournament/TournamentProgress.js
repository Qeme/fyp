import { useTournamentContext } from "src/hooks/useTournamentContext";
import { useParams } from "react-router-dom";
import TournamentSingleElimination from "./TournamentSingleElimination";
import TournamentDoubleElimination from "./TournamentDoubleElimination";
import TournamentAllPlayAll from "./TournamentAllPlayAll";

function TournamentProgress() {
  const { id } = useParams();
  const { tournaments } = useTournamentContext();

  const tournament = tournaments.find((tour) => tour._id === id);

  return (
    <div>
      <div>TournamentProgress {id}</div>
      {tournament &&
        tournament.setting.stageOne.format === "single-elimination" && (
          <TournamentSingleElimination id={id} />
        )}
      {tournament &&
        tournament.setting.stageOne.format === "double-elimination" && (
          <TournamentDoubleElimination id={id} />
        )}
      {tournament &&
        (tournament.setting.stageOne.format === "round-robin" ||
          tournament.setting.stageOne.format === "double-round-robin") && (
          <TournamentAllPlayAll id={id} />
        )}
    </div>
  );
}

export default TournamentProgress;
