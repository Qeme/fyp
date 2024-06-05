import { useContext } from "react";
import { VenueContext } from "../context/VenueContext";

export const useVenueContext = () => {
  // we apply the useContext() and inside argument we passed the VenueContext function (it has value in it)
  const context = useContext(VenueContext);

  /* 
    however, in the dev later, when we accidentally miss put the VenueContext.Provider for wrong components (outside the context tree)
    we can check them by putting an error message
  */
  if (!context) {
    // we THROW and ERROR the message
    throw Error("useVenueContext MUST be used inside an VenueContextProvider");
  }

  return context;
};
