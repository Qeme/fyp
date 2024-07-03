"use client";

import { Link, useParams } from "react-router-dom";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "src/components/ui/accordion";

const Tournament = () => {
  const { id } = useParams();
  const { tournaments } = useTournamentContext();
  const { games } = useGameContext();
  const { users } = useUserContext();
  const { venues } = useVenueContext();

  // find the tournament
  const tournament = tournaments.find((tournament) => tournament._id === id);

  return (
    <main>
      <div className="flex justify-center w-full space-x-4">
        <div className="flex w-3/5">
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle>
                <span className="font-bold text-3xl uppercase">
                  Tournament Details
                </span>
              </CardTitle>
              <CardDescription className="w-1/2 mx-auto">
                Ready to compete and showcase your skills? Join our exciting
                tournament now! Fill out the form and be part of the action!
              </CardDescription>
              <PreviewImage topic={"tour_bg"} tournamentid={tournament._id} />
            </CardHeader>

            <CardContent className="px-12">
              <div>
                <div className="flex flex-col items-center">
                  <div className="p-4 mb-8">
                    <h3 className="text-xl font-bold uppercase">information</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-3 w-3/5">
                    <span className="font-semibold">Name </span>
                    <span>{tournament.name}</span>
                    <span className="font-semibold">Game</span>
                    <span>
                      {(games &&
                        games.find((g) => g._id === tournament.meta.game_id)
                          ?.name) || <span>Recently deleted by Admin</span>}
                    </span>
                    <span className="font-semibold">Venue</span>
                    <span>
                      {(venues &&
                        venues.find((v) => v._id === tournament.meta.venue_id)
                          ?.building) || <span>Recently deleted by Admin</span>}
                    </span>
                    <span className="font-semibold">Organizer</span>
                    <span>
                      {(users &&
                        users.find(
                          (u) => u._id === tournament.meta.organizer_id
                        )?.email) || <span>Recently deleted by Admin</span>}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="p-4 my-8">
                    <h3 className="text-xl font-bold uppercase">
                      representative
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-3 w-3/5">
                    <span className="font-semibold">Type</span>
                    <span className="capitalize">
                      {tournament.meta.representative.repType}
                    </span>

                    {tournament &&
                    tournament.meta.representative.repType === "team" ? (
                      <>
                        <span className="font-semibold">Assigned Teammate</span>
                        <span>{tournament.meta.representative.numPlayers}</span>
                      </>
                    ) : (
                      ""
                    )}
                    <span className="font-semibold">Players Order</span>
                    {tournament && tournament.setting.colored === "true" ? (
                      <span>Applicable</span>
                    ) : (
                      <span>Not Applicable</span>
                    )}

                    <span className="font-semibold">Players Sorting</span>
                    {tournament && tournament.setting.sorting === "none" ? (
                      <span>Not Applicable</span>
                    ) : (
                      <span>{tournament.setting.sorting}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="p-4 mt-8">
                    <h3 className="text-xl font-bold uppercase">scoring</h3>
                  </div>

                  <table className="w-1/2 mt-4">
                    <thead>
                      <tr className="m-0 border-t p-0 even:bg-muted">
                        <th className="border px-4 py-2 text-center font-bold bg-orange-400 w-1/6 [&[align=center]]:text-center [&[align=right]]:text-right">
                          Type
                        </th>
                        <th className="border px-4 py-2 text-center font-bold bg-orange-200 w-1/6 [&[align=center]]:text-center [&[align=right]]:text-right">
                          Win
                        </th>
                        <th className="border px-4 py-2 text-center font-bold bg-orange-200 w-1/6 [&[align=center]]:text-center [&[align=right]]:text-right">
                          Loss
                        </th>
                        <th className="border px-4 py-2 text-center font-bold bg-orange-200 w-1/6 [&[align=center]]:text-center [&[align=right]]:text-right">
                          Draw
                        </th>
                        <th className="border px-4 py-2 text-center font-bold bg-orange-200 w-1/6 [&[align=center]]:text-center [&[align=right]]:text-right">
                          Bye
                        </th>
                        <th className="border px-4 py-2 text-center font-bold bg-orange-200 w-1/6 [&[align=center]]:text-center [&[align=right]]:text-right">
                          BestOf
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="m-0 border-t p-0 even:bg-muted">
                        <td className="border px-4 py-2 text-center font-bold w-1/6 bg-gray-400 [&[align=center]]:text-center [&[align=right]]:text-right ">
                          Values
                        </td>
                        <td className="border px-4 py-2 text-center w-1/6 bg-gray-300 [&[align=center]]:text-center [&[align=right]]:text-right">
                          {tournament.setting.scoring.win}
                        </td>
                        <td className="border px-4 py-2 text-center w-1/6 bg-gray-300 [&[align=center]]:text-center [&[align=right]]:text-right">
                          {tournament.setting.scoring.loss}
                        </td>
                        <td className="border px-4 py-2 text-center w-1/6 bg-gray-300 [&[align=center]]:text-center [&[align=right]]:text-right">
                          {tournament.setting.scoring.draw}
                        </td>
                        <td className="border px-4 py-2 text-center w-1/6 bg-gray-300 [&[align=center]]:text-center [&[align=right]]:text-right">
                          {tournament.setting.scoring.bye}
                        </td>
                        <td className="border px-4 py-2 text-center w-1/6 bg-gray-300 [&[align=center]]:text-center [&[align=right]]:text-right">
                          {tournament.setting.scoring.bestOf}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col items-center">
                  <div className="p-4 my-8">
                    <h3 className="text-xl font-bold uppercase">Stages</h3>
                  </div>

                  <div className="flex justify-between space-x-4">
                    <div>
                      <Card className="min-w-[250px] min-h-[230px]">
                        <CardHeader className="text-center">
                          <h4>Stage One</h4>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                            <span>Format</span>
                            <span className="capitalize">
                              {tournament.setting.stageOne.format}
                            </span>
                            <span>Participants</span>
                            {tournament &&
                            tournament.setting.stageOne.maxPlayers === 0 ? (
                              <span className="capitalize">no limit</span>
                            ) : (
                              <span className="capitalize">
                                {tournament.setting.stageOne.maxPlayers} players
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div>
                      {tournament.setting.stageOne.format === "swiss" ||
                      tournament.setting.stageOne.format === "round-robin" ||
                      tournament.setting.stageOne.format ===
                        "double-round-robin" ? (
                        <div>
                          <Card className="min-w-[250px] min-h-[230px]">
                            <CardHeader className="text-center">
                              <h4>Stage Two</h4>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                                <span>Format</span>
                                <span className="capitalize">
                                  {tournament.setting.stageTwo.format}
                                </span>
                                <span>Advance Method</span>
                                <span className="capitalize">
                                  {tournament.setting.stageTwo.advance.method}
                                </span>
                                {tournament &&
                                tournament.setting.stageTwo.advance.method !==
                                  "all" ? (
                                  <>
                                    <span>Advance Value</span>
                                    <span>
                                      {
                                        tournament.setting.stageTwo.advance
                                          .value
                                      }
                                    </span>
                                  </>
                                ) : (
                                  ""
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ) : (
                        <div>
                          <Card className="min-w-[250px] min-h-[230px]">
                            <CardHeader className="text-center">
                              <h4>Stage Two</h4>
                            </CardHeader>
                            <CardContent className="text-center">
                              <span>Not Applicable</span>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="p-4 my-8">
                    <h3 className="text-xl font-bold uppercase">Date & Time</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-3 w-3/5">
                    <span>Register Date</span>
                    <span>
                      {new Date(
                        tournament.meta.register?.from
                      ).toLocaleDateString()}{" "}
                      -{" "}
                      {new Date(
                        tournament.meta.register?.to
                      ).toLocaleDateString()}
                    </span>

                    <span>Running Date</span>
                    <span>
                      {new Date(
                        tournament.meta.running?.from
                      ).toLocaleDateString()}{" "}
                      -{" "}
                      {new Date(
                        tournament.meta.running?.to
                      ).toLocaleDateString()}
                    </span>
                    <span>Check In</span>
                    <span> {tournament.meta.checkin} minutes</span>
                  </div>
                </div>

                <div>
                  <div className="p-4 mt-8 text-center">
                    <h3 className="text-xl font-bold uppercase">
                      notification
                    </h3>
                  </div>
                  <div>
                    <div className="p-2 my-4 text-center">
                      <h4 className="text-2sm font-semibold uppercase">
                        rules
                      </h4>
                    </div>
                    <ScrollArea className="min-h-[100px] w-full rounded-md border p-4">
                      {tournament.meta.notification.rules}
                    </ScrollArea>
                  </div>
                  <div>
                    <div className="p-2 my-4 text-center">
                      <h4 className="text-2sm font-semibold uppercase">
                        regulation
                      </h4>
                    </div>
                    <ScrollArea className="min-h-[100px] w-full rounded-md border p-4">
                      {tournament.meta.notification.regulation}
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col w-2/5 space-y-4">
          <div>
            <Card
              key={tournament._id}
              className="flex flex-col justify-between overflow-hidden shadow-md"
            >
              <PreviewImage
                topic={"tour_banner"}
                tournamentid={tournament._id}
              />

              <CardContent>
                <div>
                  <div className="my-2">
                    <p>Participants: </p>
                  </div>
                  {tournament && tournament.setting.players.length > 0 ? (
                    <div className="grid grid-cols-8 gap-4">
                      {tournament.setting.players.map((player) => {
                        const user = users.find(
                          (user) => user._id === player.id
                        );
                        return user ? (
                          <AvatarProfile participant={user} key={user.id} />
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-400">No Participants In Record</p>
                    </div>
                  )}
                </div>
                <div className="mt-8">
                  <div className="my-2">
                    <p>Spectators: </p>
                  </div>
                  {tournament && tournament.meta.spectator_id.length > 0 ? (
                    <div className="grid grid-cols-8 gap-4">
                      {tournament.meta.spectator_id.map((spectator) => {
                        const user = users.find(
                          (user) => user._id === spectator.id
                        );
                        return user ? (
                          <AvatarProfile participant={user} key={user.id} />
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-400">No Spectators In Record</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-base">
                  Stage One Preview
                </AccordionTrigger>
                <AccordionContent>
                  <div>
                    {tournament &&
                    tournament.setting.stageOne.format ===
                      "single-elimination" ? (
                      <>
                        <img
                          src="/images/single-elimination.png"
                          alt="single elimination"
                          className="rounded-md object-cover aspect-w-3 aspect-h-2"
                        />

                        <figcaption className="text-center mt-2 text-sm text-gray-600">
                          Single Elimination Tournament
                        </figcaption>
                        <div className="text-center p-4">
                          <Link
                            to={`/tournaments/preview/single/${tournament._id}`}
                          >
                            Watch Bracket Live Here
                          </Link>
                        </div>
                      </>
                    ) : tournament.setting.stageOne.format ===
                      "double-elimination" ? (
                      <>
                        <img
                          src="/images/double-elimination.png"
                          alt="double elimination"
                          className="rounded-md object-cover aspect-w-3 aspect-h-2"
                        />

                        <figcaption className="text-center mt-2 text-sm text-gray-600">
                          Double Elimination Tournament
                        </figcaption>
                        <div className="text-center p-4">
                          <Link
                            to={`/tournaments/preview/double/${tournament._id}`}
                          >
                            Watch Bracket Live Here
                          </Link>
                        </div>
                      </>
                    ) : tournament.setting.stageOne.format === "swiss" ? (
                      <>
                        <img
                          src="/images/swiss.png"
                          alt="swiss"
                          className="rounded-md object-cover aspect-w-3 aspect-h-2"
                        />

                        <figcaption className="text-center mt-2 text-sm text-gray-600">
                          Swiss Tournament
                        </figcaption>
                        <div className="text-center p-4">
                          <Link
                            to={`/tournaments/preview/playall/${tournament._id}`}
                          >
                            Watch Bracket Live Here
                          </Link>
                        </div>
                      </>
                    ) : tournament.setting.stageOne.format === "round-robin" ||
                      tournament.setting.stageOne.format ===
                        "double-round-robin" ? (
                      <>
                        <img
                          src="/images/round-robin.png"
                          alt="round robin / double round robin"
                          className="rounded-md object-cover aspect-w-3 aspect-h-2"
                        />

                        <figcaption className="text-center mt-2 text-sm text-gray-600">
                          Round Robin Tournament
                        </figcaption>
                        <div className="text-center p-4">
                          <Link
                            to={`/tournaments/preview/playall/${tournament._id}`}
                          >
                            Watch Bracket Live Here
                          </Link>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-base">
                  Stage Two Preview
                </AccordionTrigger>
                <AccordionContent>
                  <div>
                    {tournament &&
                    tournament.setting.stageTwo.format ===
                      "single-elimination" ? (
                      <>
                        <img
                          src="/images/single-elimination.png"
                          alt="single elimination"
                          className="rounded-md object-cover aspect-w-3 aspect-h-2"
                        />

                        <figcaption className="text-center mt-2 text-sm text-gray-600">
                          Single Elimination Tournament
                        </figcaption>
                        <div className="text-center p-4">
                          <Link
                            to={`/tournaments/preview/single/${tournament._id}`}
                          >
                            Watch Bracket Live Here
                          </Link>
                        </div>
                      </>
                    ) : tournament.setting.stageTwo.format ===
                      "double-elimination" ? (
                      <>
                        <img
                          src="/images/double-elimination.png"
                          alt="double elimination"
                          className="rounded-md object-cover aspect-w-3 aspect-h-2"
                        />

                        <figcaption className="text-center mt-2 text-sm text-gray-600">
                          Double Elimination Tournament
                        </figcaption>
                        <div className="text-center p-4">
                          <Link
                            to={`/tournaments/preview/double/${tournament._id}`}
                          >
                            Watch Bracket Live Here
                          </Link>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Tournament;
