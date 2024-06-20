import { useEffect } from "react";
import { useAuthContext } from "./useAuthContext";
import { useUserContext } from "./useUserContext";

export const useInitialUser = () => {
  const { users, dispatch } = useUserContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchInit = async () => {
      const response = await fetch("http://localhost:3002/api/users");

      const json = await response.json()

      if(response.ok){
        dispatch({type: "SET_USERS", payload: json})
      }
    };

    if(user){
        fetchInit();
    }
  },[dispatch, user]);

  // we then return these 2 things to be used for context
  return { users, dispatch };
};
