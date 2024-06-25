import { useAuthContext } from "../../hooks/useAuthContext";
import { useInitialTournament } from "src/hooks/useInitialTournament";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import { useInitialGame } from "src/hooks/useInitialGame";
import { useInitialVenue } from "src/hooks/useInitialVenue";
import { Button } from "src/components/ui/button";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { TournamentEditTrigger } from "./TournamentEditTrigger";

function TournamentMonitor() {
  const { tournaments, dispatch } = useInitialTournament();
  const { games } = useInitialGame();
  const { venues } = useInitialVenue();
  const { user } = useAuthContext();

  const monitoredTournament = tournaments?.filter(
    (tournament) => tournament.meta.organizer_id === user._id
  );

  // create a function to handle DELETE tournament by grabbing the id of the tournament as argument
  const handleClickDelete = async ({ id }) => {
    // if no user at all, just disable the delete button functionality
    if (!user) {
      return;
    }

    try {
      // create a variable to delete one particular id, make sure include method: DELETE
      const response = await fetch(
        "http://localhost:3002/api/tournaments/" + id,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // pass the json data from response either as single data (deleted) or error data
      const json = await response.json();

      if (response.ok) {
        // as we grab all the json tournaments data, we now DELETE that TOURNAMENT by using the dispatch (filter the tournaments)
        dispatch({ type: "DELETE_TOURNAMENT", payload: json });
      } else {
        // if no response, send error to console
        console.error("Error deleting the tournament:", response.statusText);
      }
    } catch (error) {
      // this error indicates the fetching process not working at all, has backend problem
      console.error("Error fetching tournaments:", error);
    }
  };

  // publish tournament function
  const handleClickPublish = async ({ id }) => {
    if (!user) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3002/api/tournaments/publish/" + id,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "UPDATE_TOURNAMENT", payload: json });
      }
    } catch (error) {
      console.error("Error publishing tournaments:", error);
    }
  };

  // start tournament function
  const handleClickStart = async ({ id }) => {
    if (!user) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3002/api/tournaments/start/" + id,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "UPDATE_TOURNAMENT", payload: json });
      }
    } catch (error) {
      console.error("Error starting tournaments:", error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md my-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Tournaments List</h2>
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">
              Tournament ID
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tournament Name
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Game
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Venue
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stage One
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stage Two
            </TableHead>
            <TableHead className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Participants
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progression
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created Date
            </TableHead>
            <TableHead className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          {monitoredTournament &&
            monitoredTournament.map((tournament) => (
              <TableRow key={tournament._id}>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {tournament._id}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tournament.name}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {games &&
                    games.find((game) => game._id === tournament.meta.game_id)
                      ?.name}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {venues &&
                    venues.find(
                      (venue) => venue._id === tournament.meta.venue_id
                    )?.building}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tournament.setting.stageOne.format}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tournament.setting.stageTwo.format}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {tournament.setting.players.length}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tournament.meta.status}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {tournament.setting.status}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(tournament.createdAt), "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <Button
                    onClick={() => handleClickDelete({ id: tournament._id })}
                  >
                    Delete
                  </Button>

                  {tournament.meta.status === "created" ? (
                    <div>
                      <TournamentEditTrigger tournament={tournament} />
                      <Button
                        onClick={() =>
                          handleClickPublish({ id: tournament._id })
                        }
                      >
                        Publish
                      </Button>
                    </div>
                  ) : (
                    ""
                  )}
                  {tournament.meta.status === "published" ? (
                    <div>
                      <Button
                        onClick={() => handleClickStart({ id: tournament._id })}
                      >
                        Start
                      </Button>

                      <Button asChild>
                      <Link href="/payments/verify/:id">Verify</Link></Button>
                    </div>
                  ) : (
                    ""
                  )}
                  {tournament.meta.status === "running" ? (
                    <Button asChild>
                      <Link href="/tournaments/progress">Progress</Link>
                    </Button>
                  ) : (
                    ""
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default TournamentMonitor;
