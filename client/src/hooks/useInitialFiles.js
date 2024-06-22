import { useEffect } from "react";
import { useAuthContext } from "./useAuthContext";
import { useFileContext } from "./useFileContext";

export const useInitialFiles = () => {
  const { files, dispatch } = useFileContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchInit = async () => {
      const response = await fetch("http://localhost:3002/api/files", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json()

      if(response.ok){
        dispatch({type: "SET_FILES", payload: json})
      }
    };

    if(user){
        fetchInit();
    }
  },[dispatch, user]);

  // we then return these 2 things to be used for context
  return { files, dispatch };
};
