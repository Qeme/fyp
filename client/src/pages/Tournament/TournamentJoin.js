import { useInitialTournament } from "src/hooks/useInitialTournament";
import { useAuthContext } from "../../hooks/useAuthContext";
import TournamentCard from "./TournamentCard";
import { useTeamContext } from "src/hooks/useTeamContext";

function TournamentJoin() {
  const { tournaments } = useInitialTournament();
  const { teams } = useTeamContext();
  const { user } = useAuthContext();

  const userTeam = teams.filter((team) => team.manager === user._id);

  const publishedTournaments = tournaments.filter((tournament) => {
    const isPublished = tournament.meta.status === "published";
    const isNotOrganizer = tournament.meta.organizer_id !== user._id;
    const isNotJoined = !tournament.setting.players.some(
      (player) => player.id === user._id
    );
    const isNotTeamJoined = !userTeam.some((team) =>
      tournament.setting.players.some((player) => player.id === team._id)
    );

    return isPublished && isNotOrganizer && isNotJoined && isNotTeamJoined;
  });

  return (
    <main>
      <TournamentCard tournaments={publishedTournaments} />
    </main>
  );
}

export default TournamentJoin;
