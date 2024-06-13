import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTournamentContext } from "../../hooks/useTournamentContext";
import { useGameContext } from "../../hooks/useGameContext";
import { useVenueContext } from "../../hooks/useVenueContext";
import CancelButton from "../../components/CancelButton";
import PreviewImage from "../../components/PreviewImage";

function TournamentJoinForm() {
  const { id } = useParams();
  const { tournaments } = useTournamentContext();
  const { games } = useGameContext();
  const { venues } = useVenueContext();

  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    if (tournaments && id) {
      const foundTournament = tournaments.find(
        (tournament) => tournament._id === id
      );
      setTournament(foundTournament);
    }
  }, [id, tournaments]);

  if (!tournament) {
    return <div>Loading...</div>;
  }

  const game = games.find((g) => g._id === tournament?.meta?.game_id);
  const venue = venues.find((v) => v._id === tournament?.meta?.venue_id);

  return (
    <div>
      <h2>Tournament Payment Details: </h2>
      <p>Name: {tournament.name}</p>
      <p>Game: {game ? game.name : "Recently deleted by Admin"}</p>
      <p>Venue: {venue ? venue.building : "Recently deleted by Admin"}</p>
      <p>
        Representative: {tournament.meta.representative.repType}{" "}
        {tournament.meta.representative.repType === "team"
          ? tournament.meta.representative.numPlayers
          : ""}
      </p>
      <h3>QR Image</h3>
      <PreviewImage topic={"tour_qr"} tournamentid={id}/>
      
      <p>Competitor Ticket Price: RM {tournament.meta.ticket.competitor}</p>
      <p>Spectator Ticket Price: RM {tournament.meta.ticket.viewer}</p>

      <CancelButton />
    </div>
  );
}

export default TournamentJoinForm;
