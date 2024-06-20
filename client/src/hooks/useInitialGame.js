import { useEffect } from "react";
import { useAuthContext } from "./useAuthContext";
import { useGameContext } from "./useGameContext";

export const useInitialGame = () => {
  const { games, dispatch } = useGameContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchInit = async () => {
      const response = await fetch("http://localhost:3002/api/games", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json()

      if(response.ok){
        dispatch({type: "SET_GAMES", payload: json})
      }
    };

    if(user){
        fetchInit();
    }
  },[dispatch, user]);

  // we then return these 2 things to be used for context
  return { games, dispatch };
};
