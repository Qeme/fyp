import { createContext, useReducer } from "react";

/* 
  declare a constant variable to hold the createContext funtion
  export it as well so it can be used by the custom hook useRoundContext
*/
export const RoundContext = createContext();

/*
  this is a function that will apply the useReducer()
  useReducer() is helping the by organizing and scaling the code when too many useState is being used
  just remember useReducer is like a condition logic where repetetitive or complex one can be here

  state is the value that you are currently working on (rounds in this case)
  action is {{type: 'SET_rounds', payload: rounds / book: { title: A , author: B }}} 
*/
export const roundReducer = (state, action) => {
  switch (action.type) {
    case "SET_ROUNDS":
      return {
        ...state, //please do not forget to spread the state
        rounds: action.payload, //this part basically SETTING UP the rounds value
      };
    case "INSERT_ROUND":
      return {
        ...state,
        rounds: [action.payload, ...state.rounds], // ...state.rounds is basically set up the current value (if not mentioned, it will completely replaced the original one)
      };
    case "UPDATE_ROUND":
      return {
        ...state,
        rounds: state.rounds.map((round) =>
          round._id === action.payload._id ? action.payload : round
        ),
      };
    default:
      return state; // send back the state if no case is run (ESSENTIAL)
  }
};

/* 
  declare a constant variable to hold the useContext (RoundContext) provider
  export it as well, take the children argument and insert it into <Provider> tag
*/
export const RoundContextProvider = ({ children }) => {
  // apply useReducer(the function, the initial value for the state)
  const [state, dispatch] = useReducer(roundReducer, { rounds: [] });

  // this will cover the context section to the index.js <App /> tag
  return (
    // we then put value argument -> state: the current value here -> dispatch: the funct that will help sending the {type,payload}
    <RoundContext.Provider value={{ ...state, dispatch }}>
      {children}
    </RoundContext.Provider>
  );
};
