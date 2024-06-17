import { createContext, useReducer } from "react";

/* 
  declare a constant variable to hold the createContext funtion
  export it as well so it can be used by the custom hook useGameContext
*/
export const GameContext = createContext();

/*
  this is a function that will apply the useReducer()
  useReducer() is helping the by organizing and scaling the code when too many useState is being used
  just remember useReducer is like a condition logic where repetetitive or complex one can be here

  state is the value that you are currently working on (games in this case)
  action is {{type: 'SET_GAMES', payload: games / book: { title: A , author: B }}} 
*/
export const gameReducer = (state, action) => {
  switch (action.type) {
    case "SET_GAMES":
      return {
        ...state, //please do not forget to spread the state
        games: action.payload, //this part basically SETTING UP the games value
      };
    case "CREATE_GAME":
      return {
        ...state,
        games: [action.payload, ...state.games], // ...state.games is basically set up the current value (if not mentioned, it will completely replaced the original one)
      };
    case "UPDATE_GAME":
      return {
        ...state,
        games: state.games.map((game) =>
          game._id === action.payload._id ? action.payload : game
        ),
      };
    case "DELETE_GAME":
      return {
        ...state,
        games: state.games.filter((game) => game._id !== action.payload._id), // the games value will be replaced by using filter->only take the games that id is not same with the id that is being
      };
    default:
      return state; // send back the state if no case is run (ESSENTIAL)
  }
};

/* 
  declare a constant variable to hold the useContext (GameContext) provider
  export it as well, take the children argument and insert it into <Provider> tag
*/
export const GameContextProvider = ({ children }) => {
  // apply useReducer(the function, the initial value for the state)
  const [state, dispatch] = useReducer(gameReducer, { games: [] });

  // this will cover the context section to the index.js <App /> tag
  return (
    // we then put value argument -> state: the current value here -> dispatch: the funct that will help sending the {type,payload}
    <GameContext.Provider value={{ ...state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
