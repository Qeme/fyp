import { useContext } from "react";
import { RoundContext } from "../context/RoundContext";

export const useRoundContext = () => {
  // we apply the useContext() and inside argument we passed the RoundContext function (it has value in it)
  const context = useContext(RoundContext);

  /* 
    however, in the dev later, when we accidentally miss put the RoundContext.Provider for wrong components (outside the context tree)
    we can check them by putting an error message
  */
  if (!context) {
    // we THROW and ERROR the message
    throw Error("useRoundContext MUST be used inside an RoundContextProvider");
  }

  return context;
};
