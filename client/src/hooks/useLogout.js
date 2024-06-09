// think like this, as you logout, what is the thing might change
// the state of the user AND the localStorage that store user data
// both of these need to be null or removed
// hence no backend process involved in this matters

import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  // call the dispatch function from useAuthContext as this is the hook that can grab the context data
  const { dispatch } = useAuthContext();

  // create a function logout
  const logout = () => {
    // remove user from the localStorage
    localStorage.removeItem("user");

    // dispatch logout action, no payload as in LOGOUT just change user state to null
    dispatch({ type: "LOGOUT" });
  };

  // export the logout so that it can be used inside logout button
  return { logout };
};