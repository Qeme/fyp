import { useContext } from "react";
import { GameContext } from "../context/GameContext";

export const useGameContext = () => {
  // we apply the useContext() and inside argument we passed the GameContext function (it has value in it)
  const context = useContext(GameContext);

  /* 
    however, in the dev later, when we accidentally miss put the GameContext.Provider for wrong components (outside the context tree)
    we can check them by putting an error message
  */
  if (!context) {
    // we THROW and ERROR the message
    throw Error("useGameContext MUST be used inside an GameContextProvider");
  }

  return context;
};
