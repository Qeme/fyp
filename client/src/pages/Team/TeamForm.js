"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";
import { Input } from "src/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "src/components/ui/button";
import { useAuthContext } from "src/hooks/useAuthContext";
import { useTeamContext } from "src/hooks/useTeamContext";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Required field"),
  email: z
    .array(z.string().email("Invalid email").min(1, "Required field"))
    .min(1, "At least one email is required"),
  player_name: z
    .array(z.string().min(1, "Required field"))
    .min(1, "At least one player name is required"),
  /*
    1. the email and player are in array later we pass it into an object of players
    2. so the array must have be filled
    3. the data type are both string
  */
});

const TeamForm = () => {
  const { user } = useAuthContext();
  const { dispatch } = useTeamContext();
  const [error, setError] = useState(null);
  const [numPlayers, setNumPlayers] = useState(1);

  const onSubmit = async (values) => {
    // console.log(values);
    if (!user) {
      return;
    }

    // Prepare players array with email and player_name pairs
    const players = [];
    for (let i = 0; i < values.email.length; i++) {
      players.push({
        email: values.email[i],
        name: values.player_name[i],
      });
    }

    // Add players array to values object
    values.players = players;

    // Add manager id here as well
    values.manager = user._id;

    // console.log(values);

    // call the fetch API
    const response = await fetch("http://localhost:3002/api/teams", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    // grab the json data
    const json = await response.json();
    // console.log(json);

    if (response.ok) {
      dispatch({ type: "CREATE_TEAM", payload: json });
      form.reset();
      setNumPlayers(1);
    } else {
      setError(json.error);
      setNumPlayers(1);
    }
  };

  // define form object
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: [""],
      player_name: [""],
    },
  });

  // this function is used to iterate the email and name for player(s)
  const handleNumPlayersChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value, 10) || 1);
    setNumPlayers(value);

    // Adjust the email and player_name arrays to match the number of players (controlled)
    form.setValue(
      "email",
      Array.from(
        { length: value },
        (_, i) => form.getValues(`email.${i}`) || ""
      )
    );
    form.setValue(
      "player_name",
      Array.from(
        { length: value },
        (_, i) => form.getValues(`player_name.${i}`) || ""
      )
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-screen-sm mx-auto bg-white p-16 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-12 text-center">Add Your Team</h2>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Team Axoyn"
                    {...field}
                    className="border-gray-300 rounded-lg px-3 py-2 w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center space-x-4">
            <FormLabel>Number of Players</FormLabel>
            <Input
              type="number"
              min="1"
              max="20"
              value={numPlayers}
              onChange={handleNumPlayersChange}
              className="border-gray-300 rounded-lg px-3 py-2 w-16"
            />
          </div>

          {Array.from({ length: numPlayers }).map((_, index) => (
            <div key={index} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`player_name.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player Name {index + 1}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={`Player ${index + 1} Name`}
                          {...field}
                          className="border-gray-300 rounded-lg px-3 py-2 w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`email.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player Email {index + 1}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={`Player ${index + 1} Email`}
                          {...field}
                          className="border-gray-300 rounded-lg px-3 py-2 w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full mt-8" type="submit">
          Submit
        </Button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>
    </Form>
  );
};

export default TeamForm;
