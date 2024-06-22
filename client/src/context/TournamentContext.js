import { createContext, useReducer } from "react";

/* 
  declare a constant variable to hold the createContext function
  export it as well so it can be used by the custom hook useTournamentContext
*/
export const TournamentContext = createContext();

/*
  this is a function that will apply the useReducer()
  useReducer() is helping the by organizing and scaling the code when too many useState is being used
  just remember useReducer is like a condition logic where repetetitive or complex one can be here

  state is the value that you are currently working on (tournaments in this case)
  action is {{type: 'SET_TOURNAMENTS', payload: tournaments / book: { title: A , author: B }}} 
*/
export const tournamentReducer = (state, action) => {
  switch (action.type) {
    case "SET_TOURNAMENTS":
      return {
        ...state, //please do not forget to spread the state
        tournaments: action.payload, //this part basically SETTING UP the tournaments value
      };
    case "CREATE_TOURNAMENT":
      return {
        ...state,
        tournaments: [action.payload, ...state.tournaments], // ...state.tournaments is basically set up the current value (if not mentioned, it will completely replaced the original one)
      };
    case "UPDATE_TOURNAMENT":
      return {
        ...state,
        tournaments: state.tournaments.map((tournament) =>
          tournament._id === action.payload._id ? action.payload : tournament
        ),
      };
    case "DELETE_TOURNAMENT":
      return {
        ...state,
        tournaments: state.tournaments.filter(
          (tournament) => tournament._id !== action.payload._id
        ), // the tournaments value will be replaced by using filter->only take the tournament that id is not same with the id that is being
      };
    default:
      return state; // send back the state if no case is run (ESSENTIAL)
  }
};

/* 
  declare a constant variable to hold the useContext (TournamentContext) provider
  export it as well, take the children argument and insert it into <Provider> tag
*/
export const TournamentContextProvider = ({ children }) => {
  // apply useReducer(the function, the initial value for the state)
  const [state, dispatch] = useReducer(tournamentReducer, { tournaments: [] });

  // this will cover the context section to the index.js <App /> tag
  return (
    // we then put value argument -> state: the current value here -> dispatch: the funct that will help sending the {type,payload}
    <TournamentContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TournamentContext.Provider>
  );
};
