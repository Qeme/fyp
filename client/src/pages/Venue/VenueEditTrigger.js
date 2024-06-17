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
import { useVenueContext } from "src/hooks/useVenueContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";

export function VenueEditTrigger({ venue }) {
  const { user } = useAuthContext();
  const { dispatch } = useVenueContext();

  const [block, setBlock] = useState(venue.block);
  const [floorLevel, setFloorLevel] = useState(venue.floorLevel);
  const [roomNumber, setRoomNumber] = useState(venue.roomNumber);
  const [place, setPlace] = useState(venue.place);
  const [postcode, setPostcode] = useState(venue.postcode);
  const [state, setState] = useState(venue.state);
  const [country, setCountry] = useState(venue.country);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch(
      `http://localhost:3002/api/venues/${venue._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          block,
          floorLevel,
          roomNumber,
          place,
          postcode,
          state,
          country,
        }),
      }
    );

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "UPDATE_VENUE", payload: json });
      setIsDialogOpen(false); // Close the dialog
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-800 w-30 h-15" onClick={() => setIsDialogOpen(true)}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Venue</DialogTitle>
          <DialogDescription>
            Make changes to the venue here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="block" className="text-right">
              Block
            </Label>
            <Input
              id="block"
              type="text"
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="floorLevel" className="text-right">
              Floor Level
            </Label>
            <Input
              id="floorLevel"
              type="number"
              value={floorLevel}
              onChange={(e) => setFloorLevel(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="roomNumber" className="text-right">
              Room Number
            </Label>
            <Input
              id="roomNumber"
              type="number"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="place" className="text-right">
              Place
            </Label>
            <Input
              id="place"
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="postcode" className="text-right">
              Postcode
            </Label>
            <Input
              id="postcode"
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="state" className="text-right">
              State
            </Label>
            <Select onValueChange={(value) => setState(value)} value={state}>
              <SelectTrigger className="col-span-3 border-gray-300 rounded-lg">
                <SelectValue className="text-center" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Selangor">Selangor</SelectItem>
                  <SelectItem value="Negeri Sembilan">
                    Negeri Sembilan
                  </SelectItem>
                  <SelectItem value="Johor">Johor</SelectItem>
                  <SelectItem value="Kedah">Kedah</SelectItem>
                  <SelectItem value="Terengganu">Terengganu</SelectItem>
                  <SelectItem value="Kelantan">Kelantan</SelectItem>
                  <SelectItem value="Melaka">Melaka</SelectItem>
                  <SelectItem value="Pahang">Pahang</SelectItem>
                  <SelectItem value="Perak">Perak</SelectItem>
                  <SelectItem value="Perlis">Perlis</SelectItem>
                  <SelectItem value="Pulau Pinang">Pulau Pinang</SelectItem>
                  <SelectItem value="Sabah">Sabah</SelectItem>
                  <SelectItem value="Sarawak">Sarawak</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="country" className="text-right">
              Country
            </Label>
            <Input
              id="country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
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
