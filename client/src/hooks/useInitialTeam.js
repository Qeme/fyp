import { useEffect } from "react";
import { useAuthContext } from "./useAuthContext";
import { useTeamContext } from "./useTeamContext";

export const useInitialTeam = () => {  // Corrected typo here
  const { teams, dispatch } = useTeamContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchInit = async () => {
      const response = await fetch("http://localhost:3002/api/teams", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_TEAMS", payload: json });
      }
    };

    if (user) {
      fetchInit();
    }
  }, [dispatch, user]);

  // we then return these 2 things to be used for context
  return { teams, dispatch };
};
