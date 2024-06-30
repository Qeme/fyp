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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";

export function GameEditTrigger({ game, dispatch }) {
  const { user } = useAuthContext();

  const [name, setName] = useState(game.name);
  const [platform, setPlatform] = useState(game.platform);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch(
      `http://localhost:3002/api/games/${game._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name, platform }),
      }
    );

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "UPDATE_GAME", payload: json });
      setIsDialogOpen(false); // Close the dialog
    }
  };

  // Reset the form to the original game data
  const handleCancel = () => {
    // Reset to initial state
    setName(game.name);
    setPlatform(game.platform);
    // Close the dialog
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          onClick={() => setIsDialogOpen(true)}
        >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Game</DialogTitle>
          <DialogDescription>
            Make changes to the game here. Click save when you're done.
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
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="platform" className="text-right">
              Platform
            </Label>
            <Select
              onValueChange={(value) => setPlatform(value)}
              value={platform}
            >
              <SelectTrigger className="col-span-3 border-gray-300 rounded-lg">
                <SelectValue className="text-center" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="physical">Physical</SelectItem>
                  <SelectItem value="hybrid">
                    Hybrid (Online + Physical)
                  </SelectItem>
                  <SelectItem value="to be announced">
                    To Be Announced
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <div>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleClick} type="button" className="ml-2">
              Save changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
