import { useTournamentContext } from "src/hooks/useTournamentContext";
import { useParams } from "react-router-dom";
import TournamentSingleElimination from "./TournamentSingleElimination";
import TournamentDoubleElimination from "./TournamentDoubleElimination";

function TournamentProgress() {
  const { id } = useParams();
  const { tournaments } = useTournamentContext();

  const tournament = tournaments.find(tour => tour._id === id)

  return (
    <>
      <div>TournamentProgress {id}</div>
      {tournament && tournament.setting.stageOne.format === "single-elimination" && (
        <TournamentSingleElimination id={id}/>
      )}
      {tournament && tournament.setting.stageOne.format === "double-elimination" && (
        <TournamentDoubleElimination id={id}/>
      )}
    </>
  );
  
}

export default TournamentProgress;
