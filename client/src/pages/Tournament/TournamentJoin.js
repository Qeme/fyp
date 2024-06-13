import { useAuthContext } from "../../hooks/useAuthContext";
import { useTournamentContext } from "../../hooks/useTournamentContext";
import { useNavigate } from "react-router-dom";

function TournamentJoin() {
  const { tournaments } = useTournamentContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const publishedTournaments = tournaments?.filter(
    (tournament) =>
      tournament.meta.status === "published" &&
      tournament.meta.organizer_id !== user._id
  );

  const handleClick = (tourid) => {
    navigate(`/tournaments/${tourid}`);
  };

  return (
    <div>
      {publishedTournaments && publishedTournaments.length > 0 ? (
        publishedTournaments.map((tournament) => (
          <div key={tournament._id} className="tournament-card">
            <h3>{tournament.name}</h3>
            <span
              className="material-symbols-outlined"
              onClick={() => handleClick(tournament._id)}
            >
              stadia_controller
            </span>
          </div>
        ))
      ) : (
        <p>No Tournament To Join</p>
      )}
    </div>
  );
}

export default TournamentJoin;
