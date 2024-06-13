import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTournamentContext } from "../../hooks/useTournamentContext";
import { useVenueContext } from "../../hooks/useVenueContext";
import { useGameContext } from "../../hooks/useGameContext";
import BackButton from "../../components/BackButton";
import JoinButton from "../../components/JoinButton";

// create a function to get the detail of one particular tournament
const Tournament = () => {
  // we grab the id as params, similar to backend
  const { id } = useParams();
  // grab the updated tournaments from the GameContext()
  const { tournaments } = useTournamentContext();
  const { games } = useGameContext();
  const { venues } = useVenueContext();
  // create 2 useState variables for this particular page
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 
    useEffect hook where it uses () => {} because we just want to call it once, not infinitly
    it has [] to be passed, so if [id, tournaments] changed, means it will rerun the useEffect hook
  */
  useEffect(() => {
    // during the finding the tournament, make the Loading equals to true
    setLoading(true);
    // try find the that particular tournament from the tournaments using id params
    const foundTournament = tournaments.find((t) => t._id === id);

    if (foundTournament) {
      // if found, execute setTournament to change the value from null to that tournament information
      setTournament(foundTournament);
    } else {
      // if not found, just reset it back to null
      setTournament(null);
    }
    // after all finish, change back Loading to false
    setLoading(false);
  }, [id, tournaments]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tournament) {
    return <div>Tournament not found</div>;
  }

  return (
    <div>
      <h2>Tournament Information</h2>
      <p>Name: {tournament.name}</p>
      <p>
        Game:{" "}
        {(games &&
          games.find((g) => g._id === tournament.meta.game_id)?.name) ||
          "Recently deleted by Admin"}
      </p>

      <p>
        Venue:{" "}
        {(venues &&
          venues.find((v) => v._id === tournament.meta.venue_id)?.building) ||
          "Recently deleted by Admin"}
      </p>

      <h2>Representative</h2>
      <p>Type: {tournament.meta.representative.repType}</p>
      {tournament && tournament.meta.representative.repType === "team" ? (
        <div>
          Number of players: {tournament.meta.representative.numPlayers}
        </div>
      ) : (
        ""
      )}

      <p>Players Order: </p>
      {tournament && tournament.setting.colored === "true" ? (
        <div>Applicable</div>
      ) : (
        <div>Not Applicable</div>
      )}

      <p>Players Sorting: </p>
      {tournament && tournament.setting.sorting === "none" ? (
        <div>Not Applicable</div>
      ) : (
        <div>{tournament.setting.sorting}</div>
      )}

      <h3>Scoring:</h3>

      <p>Win: {tournament.setting.scoring.win}</p>
      <p>Loss: {tournament.setting.scoring.loss}</p>
      <p>Draw: {tournament.setting.scoring.draw}</p>
      <p>Bye: {tournament.setting.scoring.bye}</p>
      <p>Best Of: {tournament.setting.scoring.bestOf}</p>

      <h2>Stages</h2>
      <h3>Stage One:</h3>
      <p>Format: {tournament.setting.stageOne.format}</p>
      <p>Max Players: {tournament.setting.stageOne.maxPlayers}</p>

      <h3>Stage Two:</h3>
      <p>Format: {tournament.setting.stageTwo.format}</p>
      <p>
        Advance Method (stage 1 to stage 2):{" "}
        {tournament.setting.stageTwo.advance.method}
      </p>
      <p>
        Advance Value (stage 1 to stage 2):{" "}
        {tournament.setting.stageTwo.advance.value}
      </p>

      <h2>Time:</h2>
      <h3>Registration</h3>
      <p>
        Date Time: {tournament.meta.register.open} to{" "}
        {tournament.meta.register.close}
      </p>
      <h3>Running</h3>
      <p>
        Date Time: {tournament.meta.running.start} to{" "}
        {tournament.meta.running.end}
      </p>
      <p>Check In: {tournament.meta.checkin} minutes</p>

      <h2>Notification</h2>
      <h3>Rules: </h3>
      <p>{tournament.meta.notification.rules}</p>
      <h3>Regulation: </h3>
      <p>{tournament.meta.notification.regulation}</p>

      <h2>Tickets To Enter</h2>
      <h3>Competitor:</h3>
      <p>RM {tournament.meta.ticket.competitor}</p>
      <h3>Spectator:</h3>
      <p>RM {tournament.meta.ticket.viewer}</p>

      <BackButton />
      <JoinButton tournamentid={tournament._id} />
    </div>
  );
};

export default Tournament;
