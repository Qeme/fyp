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
import { useNavigate } from "react-router-dom";
import { TournamentEditTrigger } from "./TournamentEditTrigger";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "src/components/ui/alert-dialog";

function TournamentMonitor() {
  const { tournaments, dispatch } = useInitialTournament();
  const { games } = useInitialGame();
  const { venues } = useInitialVenue();
  const { user } = useAuthContext();
  const navigate = useNavigate();

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

  // end the tournament
  const handleClickEnd = async ({ id }) => {
    const response = await fetch(
      `http://localhost:3002/api/tournaments/end/${id}`,
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

    if (!response.ok) {
      console.error("Error ending the tournaments:", json.error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md my-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Tournaments List</h2>
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader className="bg-gray-50">
          <TableRow>
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
            <TableHead className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {tournament.meta.status}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {tournament.setting.status}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(tournament.createdAt), "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <div className="flex flex-row space-x-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your tournament and remove your data from our
                            servers. Some of the participants can't view this
                            tournament after deletion happens.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleClickDelete({ id: tournament._id })
                            }
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    {tournament.meta.status === "created" && (
                      <div className="flex flex-row space-x-2">
                        <TournamentEditTrigger tournament={tournament} />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="publishing">Publish</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. Publishing the
                                tournament will notify all active users. Please
                                note that further modifications on the
                                tournament will not be possible after this
                                point.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleClickPublish({ id: tournament._id })
                                }
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}

                    {tournament.meta.status === "published" && (
                      <div className="flex flex-row space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="starting">Start</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This action will
                                start the tournament and generate the brackets
                                based on the number of participants that have
                                joined. Registration will be closed as well.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleClickStart({ id: tournament._id })
                                }
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <Button
                          variant="verifying"
                          onClick={() =>
                            navigate(`/payments/verify/${tournament._id}`)
                          }
                        >
                          Verify
                        </Button>
                      </div>
                    )}

                    {tournament.meta.status === "running" && (
                      <div className="flex flex-row space-x-2">
                        <Button
                          variant="progressing"
                          onClick={() =>
                            navigate(`/tournaments/progress/${tournament._id}`)
                          }
                        >
                          Progress
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="default">End</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This action will
                                immediately conclude the tournament. Ending the
                                tournament will prevent score entry and halt any
                                further stages.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleClickEnd({ id: tournament._id })
                                }
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default TournamentMonitor;
