import { useAuthContext } from "src/hooks/useAuthContext";
import { useTournamentContext } from "src/hooks/useTournamentContext";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import { Button } from "src/components/ui/button";
import { useNavigate } from "react-router-dom";

function TournamentReferee() {
  const { tournaments } = useTournamentContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleMonitor = (id) => {
    navigate(`/tournaments/progress/${id}`);
  };

  return (
    <main>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tournament ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tournaments &&
              tournaments
                .filter((tournament) => tournament.meta.referee_id === user._id)
                .map((tournament) => (
                  <TableRow key={tournament._id}>
                    <TableCell>{tournament._id}</TableCell>
                    <TableCell>{tournament.name}</TableCell>
                    <TableCell>{tournament.meta.status}</TableCell>
                    <TableCell>{tournament.setting.status}</TableCell>
                    <TableCell>
                      {tournament && tournament.meta.status === "running" ? (
                        <Button onClick={() => handleMonitor(tournament._id)}>
                          Monitor
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
    </main>
  );
}

export default TournamentReferee;
