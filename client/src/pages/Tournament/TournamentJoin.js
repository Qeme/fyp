import { useInitialTournament } from "src/hooks/useInitialTournament";
import { useAuthContext } from "../../hooks/useAuthContext";
import TournamentCard from "./TournamentCard";
import { useTeamContext } from "src/hooks/useTeamContext";
import TournamentCardJoin from "./TournamentCardJoin";

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
    const isNotSpectate = !tournament.meta.spectator_id.some(
      (viewer) => viewer.id === user._id
    );
    const isNotTeamJoined = !userTeam.some((team) =>
      tournament.setting.players.some((player) => player.id === team._id)
    );

    return (
      isPublished &&
      isNotOrganizer &&
      isNotJoined &&
      isNotSpectate &&
      isNotTeamJoined
    );
  });

  const joinedTournaments = tournaments.filter((tournament) => {
    const isRunning = tournament.meta.status === "running" || tournament.meta.status === "published";
    const isNotOrganizer = tournament.meta.organizer_id !== user._id;
    const isJoined = tournament.setting.players.some(
      (player) => player.id === user._id
    );
    const isSpectate = tournament.meta.spectator_id.some(
      (viewer) => viewer.id === user._id
    );
    const isTeamJoined = userTeam.some((team) =>
      tournament.setting.players.some((player) => player.id === team._id)
    );

    return (
      isRunning && isNotOrganizer && (isJoined || isTeamJoined || isSpectate)
    );
  });

  return (
    <main>
      <div className="h-lvh">
        <TournamentCard tournaments={publishedTournaments} title="What's New" />

        <TournamentCardJoin
          tournaments={joinedTournaments}
          title="Recently Participate"
        />
      </div>
    </main>
  );
}

export default TournamentJoin;
