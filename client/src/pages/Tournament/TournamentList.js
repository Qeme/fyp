import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import React from "react";
import { format } from "date-fns";
import { Button } from "src/components/ui/button";
import { useAuthContext } from "src/hooks/useAuthContext";
import { useInitialTournament } from "src/hooks/useInitialTournament";
import { useInitialGame } from "src/hooks/useInitialGame";
import { useInitialVenue } from "src/hooks/useInitialVenue";
import { useInitialUser } from "src/hooks/useInitialUser";

const TournamentList = () => {

  const { tournaments, dispatch } = useInitialTournament();
  const { games } = useInitialGame();
  const { venues } = useInitialVenue();
  const { users } = useInitialUser();
  const { user } = useAuthContext();

  const handleClick = async ({ id }) => {
    if (!user) {
      return;
    }

    // fetch the delete API
    const response = await fetch("http://localhost:3002/api/tournaments/" + id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    // get the json response
    const json = await response.json();

    // if ok, proceed
    if (response.ok) {
      dispatch({ type: "DELETE_TOURNAMENT", payload: json });
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
              Organizer
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
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Participants
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
          {tournaments.map((tournament) => (
            <TableRow key={tournament._id}>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {tournament._id}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {tournament.name}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {users.find(user => user._id === tournament.meta.organizer_id)?.email}  
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {games.find(game => game._id === tournament.meta.game_id)?.name}  
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {venues.find(venue => venue._id === tournament.meta.venue_id)?.building}  
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {tournament.setting.stageOne.format}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {tournament.setting.stageTwo.format}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {tournament.setting.players.length}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(tournament.createdAt), "dd/MM/yyyy")}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                <Button onClick={() => handleClick({ id: tournament._id })}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TournamentList;
