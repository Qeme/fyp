import React, { useState } from "react";
import { useAuthContext } from "src/hooks/useAuthContext";
import { Button } from "src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/components/ui/dialog";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { useTeamContext } from "src/hooks/useTeamContext";

export function TeamEditTrigger({ team }) {
  const { user } = useAuthContext();
  const { dispatch } = useTeamContext();

  const [name, setName] = useState(team.name);
  const [players, setPlayers] = useState(team.players);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    const response = await fetch(
      `http://localhost:3002/api/teams/${team._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name, players }),
      }
    );

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "UPDATE_TEAM", payload: json });
      setIsDialogOpen(false); // Close the dialog
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-blue-500 hover:bg-blue-800" onClick={() => setIsDialogOpen(true)}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
          <DialogDescription>
            Make changes to the team here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Team Name
            </Label>
            <Input
              id="name"
              value={name}
              type="text"
              onChange={(e) => setName(e.target.value)}
              className="col-span-2"
            />
          </div>
          {players.map((player, index) => (
            <div key={index} className="grid grid-cols-8 items-center gap-4">
              <Label
                htmlFor={`player_name_${index}`}
                className="col-span-1 text-right"
              >
                Player {index + 1}
              </Label>
              <Input
                id={`player_name_${index}`}
                value={player.name}
                type="text"
                onChange={(e) => {
                  const updatedPlayers = players.map((player, idx) => {
                    if (idx === index) {
                      return { ...player, name: e.target.value };
                    }
                    return player;
                  });
                  setPlayers(updatedPlayers);
                }}
                className="col-span-3"
              />
              <Label
                htmlFor={`player_email_${index}`}
                className="col-span-1 text-right"
              >
                Email {index + 1}
              </Label>
              <Input
                id={`player_email_${index}`}
                value={player.email}
                type="email"
                onChange={(e) => {
                  const updatedPlayers = players.map((player, idx) => {
                    if (idx === index) {
                      return { ...player, email: e.target.value };
                    }
                    return player;
                  });
                  setPlayers(updatedPlayers);
                }}
                className="col-span-3"
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleClick} type="button">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
