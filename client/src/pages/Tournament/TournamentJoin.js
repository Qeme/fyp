import { useInitialTournament } from "src/hooks/useInitialTournament";
import { useAuthContext } from "../../hooks/useAuthContext";
import TournamentCard from "./TournamentCard";

function TournamentJoin() {
  const { tournaments } = useInitialTournament();
  const { user } = useAuthContext();

  const publishedTournaments = tournaments.filter(
    (tournament) =>
      tournament.meta.status === "published" &&
      tournament.meta.organizer_id !== user._id
  );

  return (
    <main>
      <TournamentCard tournaments={publishedTournaments} />
    </main>
  );
}

export default TournamentJoin;
