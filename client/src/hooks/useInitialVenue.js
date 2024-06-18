import { useEffect } from "react";
import { useAuthContext } from "./useAuthContext";
import { useVenueContext } from "./useVenueContext";

export const useInitialVenue = () => {
  const { dispatch } = useVenueContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchInit = async () => {
      const response = await fetch("http://localhost:3002/api/venues", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json()

      if(response.ok){
        dispatch({type: "SET_VENUES", payload: json})
      }
    };

    if(user){
        fetchInit();
    }
  },[dispatch, user]);
};
