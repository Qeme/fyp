import { useEffect } from "react";
import { useAuthContext } from "./useAuthContext";
import { useTournamentContext } from "./useTournamentContext";

export const useInitialTournament = () => {
  const { tournaments, dispatch } = useTournamentContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchInit = async () => {
      const response = await fetch("http://localhost:3002/api/tournaments", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json()

      if(response.ok){
        dispatch({type: "SET_TOURNAMENTS", payload: json})
      }
    };

    if(user){
        fetchInit();
    }
  },[dispatch, user]);

  // we then return these 2 things to be used for context
  return { tournaments, dispatch };
};
