import { createContext, useReducer } from "react";

/* 
  declare a constant variable to hold the createContext funtion
  export it as well so it can be used by the custom hook useVenueContext
*/
export const VenueContext = createContext();

/*
  this is a function that will apply the useReducer()
  useReducer() is helping the by organizing and scaling the code when too many useState is being used
  just remember useReducer is like a condition logic where repetetitive or complex one can be here

  state is the value that you are currently working on (venues in this case)
  action is {{type: 'SET_VENUES', payload: venues / book: { title: A , author: B }}} 
*/
export const venueReducer = (state, action) => {
  switch (action.type) {
    case "SET_VENUES":
      return {
        ...state, //please do not forget to spread the state
        venues: action.payload, //this part basically SETTING UP the venues value
      };
    case "CREATE_VENUE":
      return {
        ...state,
        venues: [action.payload, ...state.venues], // ...state.venues is basically set up the current value (if not mentioned, it will completely replaced the original one)
      };
    case "UPDATE_VENUE":
      return {
        ...state,
        venues: state.venues.map((venue) =>
          venue._id === action.payload._id ? action.payload : venue //updating the venue based on its id, if found replace, if not just put it back
        ),
      };
    case "DELETE_VENUE":
      return {
        ...state,
        venues: state.venues.filter(
          (venue) => venue._id !== action.payload._id
        ), // the venues value will be replaced by using filter->only take the venue that id is not same with the id that is being
      };
    default:
      return state; // send back the state if no case is run (ESSENTIAL)
  }
};

/* 
  declare a constant variable to hold the useContext (VenueContext) provider
  export it as well, take the children argument and insert it into <Provider> tag
*/
export const VenueContextProvider = ({ children }) => {
  // apply useReducer(the function, the initial value for the state)
  const [state, dispatch] = useReducer(venueReducer, { venues: [] });

  // this will cover the context section to the index.js <App /> tag
  return (
    // we then put value argument -> state: the current value here -> dispatch: the funct that will help sending the {type,payload}
    <VenueContext.Provider value={{ ...state, dispatch }}>
      {children}
    </VenueContext.Provider>
  );
};
