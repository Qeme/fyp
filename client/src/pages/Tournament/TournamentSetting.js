import { useInitialGame } from "src/hooks/useInitialGame";
import { useInitialVenue } from "src/hooks/useInitialVenue";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { Badge } from "src/components/ui/badge";

function TournamentSetting() {
  const { games } = useInitialGame();
  const { venues } = useInitialVenue();

  return (
    <main>
      <h1 className="mb-14">Settings: </h1>
      <div className="mb-40">
        <h2>Games Available</h2>
        <div className="grid grid-cols-3 gap-8">
          {games &&
            games.map((game) => (
              <Card key={game._id} className="flex flex-col justify-between">
                <CardHeader>
                  <div>
                    <CardTitle>{game.name}</CardTitle>
                    <CardDescription>{game._id}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex justify-between">
                  {game.platform === "online" ? (
                    <Badge variant={"platform_online"}>{game.platform}</Badge>
                  ) : game.platform === "physical" ? (
                    <Badge variant={"platform_physical"}>{game.platform}</Badge>
                  ) : game.platform === "hybrid" ? (
                    <Badge variant={"platform_hybrid"}>{game.platform}</Badge>
                  ) : (
                    <Badge variant={"default"}>{game.platform}</Badge>
                  )}
                  <p className="text-sm">
                    {formatDistanceToNow(new Date(game.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
      <div>
        <h2>Venues Available</h2>
        <div className="grid grid-cols-3 gap-8 mb-20">
          {venues &&
            venues.map((venue) => (
              <Card key={venue._id}>
                <CardHeader>
                  <div>
                    <CardTitle>{venue.building}</CardTitle>
                    <CardDescription>{venue._id}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="divide-y divide-gray-200">
                  <div className="grid grid-cols-2 gap-x-2 pl-4">
                    <p>
                      <strong>Block</strong>
                    </p>
                    {venue.block ? (
                      <p>{venue.block}</p>
                    ) : (
                      <p className="italic opacity-55">Not Available</p>
                    )}

                    <p>
                      <strong>Floor</strong>
                    </p>
                    {venue.floorLevel ? (
                      <p>{venue.floorLevel}</p>
                    ) : (
                      <p className="italic opacity-55">Not Available</p>
                    )}

                    <p>
                      <strong>Room</strong>
                    </p>
                    {venue.roomNumber ? (
                      <p>{venue.roomNumber}</p>
                    ) : (
                      <p className="italic opacity-55">Not Available</p>
                    )}

                    <p>
                      <strong>Place</strong>
                    </p>
                    <p>{venue.place}</p>

                    <p>
                      <strong>Address</strong>
                    </p>
                    <p>
                      {venue.postcode}, {venue.state}, {venue.country}
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex justify-end w-full">
                    <p className="text-sm">
                      {formatDistanceToNow(new Date(venue.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </main>
  );
}

export default TournamentSetting;
