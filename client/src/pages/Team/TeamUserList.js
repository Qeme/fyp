import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import React, { useEffect } from "react";
import { useTeamContext } from "src/hooks/useTeamContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { format } from "date-fns";
import { Button } from "src/components/ui/button";
import { useAuthContext } from "src/hooks/useAuthContext";
import { TeamEditTrigger } from "./TeamEditTrigger";

const TeamUserList = () => {
  const { teams, dispatch } = useTeamContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchInit = async () => {
      const response = await fetch("http://localhost:3002/api/teams", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_TEAMS", payload: json });
      }
    };

    if (user) {
      fetchInit();
    }
  }, [dispatch, user, teams]);

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
    <div className="bg-white p-6 rounded-lg shadow-md my-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Teams List</h2>
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">
              Team ID
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Team Name
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Players Detail
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Number of Players
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created Date
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
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {team._id}
                  </TableCell>
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
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                    {team.players.length}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(team.createdAt), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {formatDistanceToNow(new Date(team.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <Button
                        variant="destructive"
                        onClick={() => handleClick({ id: team._id })}
                      >
                        Delete
                      </Button>
                      <TeamEditTrigger team={team} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamUserList;
