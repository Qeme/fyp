import { useGameContext } from "../../hooks/useGameContext";
import { useVenueContext } from "../../hooks/useVenueContext";
import PreviewImage from "../../components/PreviewImage";
import { useAuthContext } from "src/hooks/useAuthContext";
import { useTeamContext } from "src/hooks/useTeamContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import UploadReceipt from "src/components/UploadReceipt";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useTournamentContext } from "src/hooks/useTournamentContext";
import { Card, CardContent, CardFooter } from "src/components/ui/card";

function TournamentJoinForm() {
  const { id } = useParams();
  const location = useLocation(); //to get the & value from the URL
  const searchParams = new URLSearchParams(location.search);
  const payertype = searchParams.get("payertype");

  const { tournaments } = useTournamentContext();
  const { games } = useGameContext();
  const { venues } = useVenueContext();
  const { teams } = useTeamContext();
  const { user } = useAuthContext();

  const [selectedTeam, setSelectedTeam] = useState(null);
  const tournament = tournaments.find((tournament) => tournament._id === id);

  return (
    <main>
      <div className="flex justify-center items-center my-20">
        <div>
          <h2 className="text-center">Payment Details</h2>
          <Card>
            <CardContent>
              <div>
                <PreviewImage topic={"tour_qr"} tournamentid={tournament._id} />
              </div>
              <p>Name: {tournament.name}</p>
              <p>
                Game:{" "}
                {games &&
                  games.find((game) => game._id === tournament.meta.game_id)
                    ?.name}
              </p>
              <p>
                Venue:{" "}
                {venues &&
                  venues.find((venue) => venue._id === tournament.meta.venue_id)
                    ?.building}
              </p>
              {payertype === "competitor" ? (
                <div>
                  <p>
                    Representative: {tournament.meta.representative.repType}
                  </p>
                  {tournament.meta.representative.repType === "team" ? (
                    <div>
                      <p>
                        Number of Teammates:{" "}
                        {tournament.meta.representative.numPlayers}
                      </p>
                      <Select onValueChange={setSelectedTeam}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select Your Team" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {teams &&
                              teams
                                .filter((team) => team.manager === user._id && team.players.length <= tournament.meta.representative.numPlayers)
                                .map((team) => (
                                  <SelectItem key={team._id} value={team._id}>
                                    {team.name}
                                  </SelectItem>
                                ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}

              <p>Participate as {payertype}</p>
              <p>
                Amount: RM{" "}
                {payertype === "competitor"
                  ? tournament.meta.ticket.competitor
                  : tournament.meta.ticket.viewer}
              </p>
            </CardContent>
            <CardFooter>
              <UploadReceipt
                tournamentid={id}
                teamid={selectedTeam}
                payertype={payertype}
              />
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default TournamentJoinForm;
