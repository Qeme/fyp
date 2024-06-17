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
import { useVenueContext } from "src/hooks/useVenueContext";

const formSchema = z.object({
  block: z.string().min(1, "Required field"),
  floorLevel: z.string(),
  roomNumber: z.string(),
  place: z.string().min(1, "Required field"),
  postcode: z.string().min(1, "Required field"),
  state: z.string().min(1, "Required field"),
  country: z.string().min(1, "Required field"),
});

const GameForm = () => {
  const { user } = useAuthContext();
  const { dispatch } = useVenueContext();

  const onSubmit = async (values) => {
    // call the fetch API
    const response = await fetch("http://localhost:3002/api/venues", {
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
      dispatch({ type: "CREATE_VENUE", payload: json });
      form.reset();
    }
  };

  // define form object
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      block: "",
      floorLevel: "",
      roomNumber: "",
      place: "",
      postcode: "",
      state: "",
      country: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Add Venues</h2>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="block"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Block</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="BM"
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
            name="floorLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Floor Level</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="03"
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
            name="roomNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="23"
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
            name="place"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Place</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Universiti Tenaga Nasional"
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
            name="postcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postcode</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="43000"
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
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
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
                        <SelectItem value="Pulau Pinang">
                          Pulau Pinang
                        </SelectItem>
                        <SelectItem value="Sabah">Sabah</SelectItem>
                        <SelectItem value="Sarawak">Sarawak</SelectItem>
                        <SelectItem value="others">Others</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Malaysia"
                    {...field}
                    className="border-gray-300 rounded-lg"
                  />
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
  );
};

export default GameForm;
