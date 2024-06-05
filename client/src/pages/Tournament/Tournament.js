import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTournamentContext } from "../../hooks/useTournamentContext";
import { useVenueContext } from "../../hooks/useVenueContext";
import { useGameContext } from "../../hooks/useGameContext";

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
      <h2>Tournament ID: {tournament._id}</h2>
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
    </div>
  );
};

export default Tournament;
