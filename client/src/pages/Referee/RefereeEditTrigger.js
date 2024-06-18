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
import { useUserContext } from "src/hooks/useUserContext";

export function RefereeEditTrigger({ referee }) {
  const { user } = useAuthContext();
  const { dispatch } = useUserContext();

  const [name, setName] = useState(referee.name);
  const [email, setEmail] = useState(referee.email);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch(
      `http://localhost:3002/api/users/${referee._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      }
    );

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "UPDATE_USER", payload: json });
      setIsDialogOpen(false); // Close the dialog
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-500 hover:bg-blue-800 w-30 h-15"
          onClick={() => setIsDialogOpen(true)}
        >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Game</DialogTitle>
          <DialogDescription>
            Make changes to the referee details here. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              type="text"
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Name
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
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
