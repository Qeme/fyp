// this custom hook is used to help in processing the login process at frontend
import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

// export the custom hook so it can be used by other components/pages
export const useLogin = () => {
  // just setup error and loading, because the email and password already being
  // processed by the login page, here we just do the login
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  // we also use the context to get the dispatch function for 'USER'
  const { dispatch } = useAuthContext();

  // create a function (inside a hook function...get the joke ? ... :P)
  // it took 2 arguments which are email and password passed inside the login page
  const login = async (email, password) => {
    // set isLoading to false and error to null, the reason is to avoid from the
    // previous error still remain in there eventhough the user already put right value
    setIsLoading(true);
    setError(null);

    // now fetch to POST the user info to LOGIN
    const response = await fetch("http://localhost:3002/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // grab the json data either the user or error message thrown by the backend
    const json = await response.json();

    // if the response gave error... handle the error message
    if (!response.ok) {
      // set isLoading to false and set error as well
      setIsLoading(false);
      setError(json.error);
    }

    // if the response ok, we need to save the JWT token information into localStorage
    // so that if the user close the tab/ browser, they can still enter the page without the
    // need to undergo login page again
    if (response.ok) {
      // save to localStorage
      localStorage.setItem("user", JSON.stringify(json));

      // update the auth context as well by using Auth dispatch
      dispatch({ type: "LOGIN", payload: json });

      // after all done, set loading back to false
      setIsLoading(false);
    }
  };

//   we then pass 3 values so whenever we call the useLogin hook, we can manipulate the data
  return { login, isLoading, error };
};