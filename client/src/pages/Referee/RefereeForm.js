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
import { useUserContext } from "src/hooks/useUserContext";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Required field"),
  email: z.string().min(1, "Required field"),
  password: z.string().min(1, "Required field"),
});

const RefereeForm = () => {
  const { user } = useAuthContext();
  const { dispatch } = useUserContext();
  const [error, setError] = useState(null);

  const onSubmit = async (values) => {
    if (!user) {
      return;
    }

    // add role: referee to values
    values.role = "referee";
    console.log(values)
    
    // call the fetch API
    const response = await fetch("http://localhost:3002/api/users", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // grab the json data
    const json = await response.json();
    console.log(json)
    
    if (response.ok) {
      dispatch({ type: "CREATE_USER", payload: json });
      form.reset();
    }else{
        setError(json.error);
    }
  };

  // define form object
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Add Referee</h2>
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
                    placeholder="John Vladmir"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="johnvladmir@gmail.com"
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Remember & Pass"
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
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>
    </Form>
  );
};

export default RefereeForm;
