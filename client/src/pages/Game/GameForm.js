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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { useAuthContext } from "src/hooks/useAuthContext";
import { useGameContext } from "src/hooks/useGameContext";

const formSchema = z.object({
  name: z.string().min(1, "Required field"),
  platform: z.string().min(1, "Required field"),
});

const GameForm = () => {
  const { user } = useAuthContext();
  const { dispatch } = useGameContext();

  const onSubmit = async (values) => {
    // call the fetch API
    const response = await fetch("http://localhost:3002/api/games", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    // grab the json data
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "CREATE_GAME", payload: json });
      form.reset();
    }
  };

  // define form object
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      platform: "",
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-center">Register Game</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full bg-white p-6 rounded-lg shadow-md"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter name of the game"
                      {...field}
                      className="border-gray-300 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="border-gray-300 rounded-lg">
                        <SelectValue
                          placeholder="-- Choose --"
                          className="text-center"
                        />
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className="w-full mt-6" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default GameForm;
