"use client";

import { useNavigate, useParams } from "react-router-dom";
import { useTournamentContext } from "../../hooks/useTournamentContext";
import { useVenueContext } from "../../hooks/useVenueContext";
import { useGameContext } from "../../hooks/useGameContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { ScrollArea } from "src/components/ui/scroll-area";
import PreviewImage from "src/components/PreviewImage";
import AvatarProfile from "src/components/AvatarProfile";
import { useUserContext } from "src/hooks/useUserContext";

const Tournament = () => {
  const { id } = useParams();
  const { tournaments } = useTournamentContext();
  const { games } = useGameContext();
  const { users } = useUserContext();
  const { venues } = useVenueContext();

  const navigate = useNavigate();

  // find the tournament
  const tournament = tournaments.find((tournament) => tournament._id === id);

  // function for handleJoin
  const handleJoinCompetitor = () => {
    navigate(`/tournaments/join/${id}?payertype=competitor`);
  };

  const handleJoinViewer = () => {
    navigate(`/tournaments/join/${id}?payertype=viewer`);
  };

  return (
    <main>
      <div className="flex justify-center w-full space-x-4">
        <div className="flex w-3/5">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Tournament Details</CardTitle>
              <CardDescription>
                Have you interested in joining the tournament? Submit the form
                now and enjoy the show.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-12">
              <div>
                <div>
                  <p>Name: {tournament.name}</p>
                  <p>
                    Game:{" "}
                    {(games &&
                      games.find((g) => g._id === tournament.meta.game_id)
                        ?.name) || <span>Recently deleted by Admin</span>}
                  </p>
                  <p>
                    Venue:{" "}
                    {(venues &&
                      venues.find((v) => v._id === tournament.meta.venue_id)
                        ?.building) || <span>Recently deleted by Admin</span>}
                  </p>
                  <p>
                    Organizer:{" "}
                    {(users &&
                      users.find((u) => u._id === tournament.meta.organizer_id)
                        ?.email) || <span>Recently deleted by Admin</span>}
                  </p>
                </div>
                <div>
                  <h3>Representative</h3>
                  <div>
                    <p>Type: {tournament.meta.representative.repType}</p>
                    {tournament &&
                    tournament.meta.representative.repType === "team" ? (
                      <p>
                        Assigned Teammate:{" "}
                        {tournament.meta.representative.numPlayers}
                      </p>
                    ) : (
                      ""
                    )}
                    <p>
                      Players Order:
                      {tournament && tournament.setting.colored === "true" ? (
                        <span>Applicable</span>
                      ) : (
                        <span>Not Applicable</span>
                      )}
                    </p>
                    <p>
                      Players Sorting:
                      {tournament && tournament.setting.sorting === "none" ? (
                        <span>Not Applicable</span>
                      ) : (
                        <span>{tournament.setting.sorting}</span>
                      )}
                    </p>
                  </div>
                </div>
                <div>
                  <h3>Scoring:</h3>
                  <table className="w-1/2">
                    <thead>
                      <tr className="m-0 border-t p-0 even:bg-muted">
                        <th className="border px-4 py-2 text-center font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                          Type
                        </th>
                        <th className="border px-4 py-2 text-center font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                          Values
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="m-0 border-t p-0 even:bg-muted">
                        <td className="border px-4 py-2 text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                          Win
                        </td>
                        <td className="border px-4 py-2 text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                          {tournament.setting.scoring.win}
                        </td>
                      </tr>
                      <tr className="m-0 border-t p-0 even:bg-muted">
                        <td className="border px-4 py-2 text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                          Loss
                        </td>
                        <td className="border px-4 py-2 text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                          {tournament.setting.scoring.loss}
                        </td>
                      </tr>
                      <tr className="m-0 border-t p-0 even:bg-muted">
                        <td className="border px-4 py-2 text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                          Draw
                        </td>
                        <td className="border px-4 py-2 text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                          {tournament.setting.scoring.draw}
                        </td>
                      </tr>
                      <tr className="m-0 border-t p-0 even:bg-muted">
                        <td className="border px-4 py-2 text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                          Bye
                        </td>
                        <td className="border px-4 py-2 text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                          {tournament.setting.scoring.bye}
                        </td>
                      </tr>
                      <tr className="m-0 border-t p-0 even:bg-muted">
                        <td className="border px-4 py-2 text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                          Best Of
                        </td>
                        <td className="border px-4 py-2 text-center [&[align=center]]:text-center [&[align=right]]:text-right">
                          {tournament.setting.scoring.bestOf}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h2>Stages</h2>
                  <div>
                    <h3>Stage One:</h3>
                    <p>Format: {tournament.setting.stageOne.format}</p>
                    <p>Max Players: {tournament.setting.stageOne.maxPlayers}</p>
                  </div>
                  {tournament.setting.stageOne.format === "swiss" ||
                  tournament.setting.stageOne.format === "round-robin" ||
                  tournament.setting.stageOne.format ===
                    "double-round-robin" ? (
                    <div>
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
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <h2>Time:</h2>
                  <div>
                    <p>
                      Register Date:{" "}
                      {new Date(
                        tournament.meta.register?.from
                      ).toLocaleDateString()}{" "}
                      to{" "}
                      {new Date(
                        tournament.meta.register?.to
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p>
                      Running Date:{" "}
                      {new Date(
                        tournament.meta.running?.from
                      ).toLocaleDateString()}{" "}
                      to{" "}
                      {new Date(
                        tournament.meta.running?.to
                      ).toLocaleDateString()}
                    </p>
                    <p>Check In: {tournament.meta.checkin} minutes</p>
                  </div>
                </div>
                <div>
                  <h2>Notification</h2>
                  <div>
                    <h3>Rules: </h3>
                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                      {tournament.meta.notification.rules}
                    </ScrollArea>
                  </div>
                  <div>
                    <h3>Regulation: </h3>
                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                      {tournament.meta.notification.regulation}
                    </ScrollArea>
                  </div>
                </div>
                <div>
                  <h2>Tickets</h2>
                  <div className="flex justify-evenly">
                    <div>
                      <p className="text-center">Competitor</p>
                      <div className="relative w-48 cursor-pointer">
                        <img
                          src="/images/blue_ticket.png"
                          alt="competitor ticket"
                          onClick={handleJoinCompetitor}
                        />
                        <span className="absolute top-20 left-14 ml-2 text-black ">
                          {tournament &&
                          tournament.meta.ticket.competitor !== 0 ? (
                            <span>RM {tournament.meta.ticket.competitor.toFixed(2)}</span>
                          ) : (
                            <span className="ml-2">FREE</span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-center">Viewer</p>
                      <div className="relative w-48 cursor-pointer">
                        <img
                          src="/images/yellow_ticket.png"
                          alt="viewer ticket"
                          onClick={handleJoinViewer}
                        />
                        <span className="absolute top-16 left-14 mt-4 ml-2 text-black ">
                          {tournament && tournament.meta.ticket.viewer !== 0 ? (
                            <span>RM {tournament.meta.ticket.viewer.toFixed(2)}</span>
                          ) : (
                            <span className="ml-2">FREE</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col w-2/5 space-y-4">
          <Card
            key={tournament._id}
            className="flex flex-col justify-between overflow-hidden shadow-md"
          >
            <PreviewImage topic={"tour_banner"} tournamentid={tournament._id} />

            <CardContent>
              <div>
                <p>Participants: </p>
              </div>
              <div>
                {tournament && tournament.setting.players.length > 0 ? (
                  tournament.setting.players.map((player) => (
                    <AvatarProfile participant={player} key={player.id} />
                  ))
                ) : (
                  <p>No Participants Join Yet</p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <p>CHAT BOX</p>
            <p>.............</p>
            {/* group chat but disabled for user that is not joining yet */}
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Tournament;
