import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { format } from "date-fns";
import { Button } from "src/components/ui/button";
import { useAuthContext } from "src/hooks/useAuthContext";
import { TeamEditTrigger } from "./TeamEditTrigger";
import { useInitialTeam } from "src/hooks/useInitialTeam";
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

const TeamUserList = () => {
  const { teams, dispatch } = useInitialTeam();
  const { user } = useAuthContext();

  const handleClick = async ({ id }) => {
    if (!user) {
      return;
    }

    // fetch the delete API
    const response = await fetch("http://localhost:3002/api/teams/" + id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    // get the json response
    const json = await response.json();

    // if ok, proceed
    if (response.ok) {
      dispatch({ type: "DELETE_TEAM", payload: json });
    }
  };

  return (
    <main>
      <div className="bg-white p-6 rounded-lg shadow-md my-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Teams List</h2>
        <Table className="min-w-full divide-y divide-gray-200">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team Name
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Players Detail
              </TableHead>
              <TableHead className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Number of Players
              </TableHead>
              <TableHead className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Creation Date
              </TableHead>
              <TableHead className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </TableHead>
              <TableHead className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {teams &&
              teams
                .filter((team) => team.manager === user._id)
                .map((team) => (
                  <TableRow key={team._id}>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {team.name}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <ol>
                        {team.players.map((player, index) => (
                          <li key={index}>
                            <div>
                              {index + 1}. {player.name}{" "}
                              <strong>({player.email})</strong>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {team.players.length}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {format(new Date(team.createdAt), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {formatDistanceToNow(new Date(team.createdAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      <div className="flex justify-center items-center space-x-2">
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
                                This action cannot be undone. This will
                                permanently delete{" "}
                                {
                                  <span className="font-semibold">
                                    {team.name}
                                  </span>
                                }{" "}
                                team and remove your data from our servers. If
                                your team is currently undergoing verification
                                or participating in an active tournament, this
                                action will result in an automatic forfeit.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleClick({ id: team._id })}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <TeamEditTrigger team={team} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
};

export default TeamUserList;
