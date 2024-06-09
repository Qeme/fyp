// think like this, as you logout, what is the thing might change
// the state of the user AND the localStorage that store user data
// both of these need to be null or removed
// hence no backend process involved in this matters

import { useAuthContext } from "./useAuthContext";
import { useGameContext } from "./useGameContext";
import { useTournamentContext } from "./useTournamentContext";
import { useVenueContext } from "./useVenueContext";

export const useLogout = () => {
  // call the dispatch function from useAuthContext as this is the hook that can grab the context data
  const { dispatch } = useAuthContext();
  const { dispatch: tournamentDispatch } = useTournamentContext();
  const { dispatch: gameDispatch } = useGameContext();
  const { dispatch: venueDispatch } = useVenueContext();

  // create a function logout
  const logout = () => {
    // remove user from the localStorage
    localStorage.removeItem("user");

    // dispatch logout action, no payload as in LOGOUT just change user state to null
    dispatch({ type: "LOGOUT" });
    // now we can clear or dispatch the SET_TOURNAMENTS to turn the value tournaments to null back
    tournamentDispatch({ type: "SET_TOURNAMENTS", payload: null });
    gameDispatch({ type: "SET_GAMES", payload: null });
    venueDispatch({ type: "SET_VENUES", payload: null });
  };

  // export the logout so that it can be used inside logout button
  return { logout };
};
