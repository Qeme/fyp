import { createContext, useReducer } from "react";

/* 
  declare a constant variable to hold the createContext funtion
  export it as well so it can be used by the custom hook useUserContext
*/
export const TeamContext = createContext();

/*
  this is a function that will apply the useReducer()
  useReducer() is helping the by organizing and scaling the code when too many useState is being used
  just remember useReducer is like a condition logic where repetetitive or complex one can be here

  state is the value that you are currently working on (teams in this case)
  action is {{type: 'SET_TEAMS', payload: teams / book: { title: A , author: B }}} 
*/
export const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_TEAMS":
      return {
        ...state, //please do not forget to spread the state
        teams: action.payload, //this part basically SETTING UP the teams value
      }; 
    case "DELETE_TEAM":
      return {
        ...state,
        teams: state.teams.filter((team) => team._id !== action.payload._id),  // the teams value will be replaced by using filter->only take the team that id is not same with the id that is being
      };
    default:
      return state; // send back the state if no case is run (ESSENTIAL)
  }
};

/* 
  declare a constant variable to hold the useContext (TeamContext) provider
  export it as well, take the children argument and insert it into <Provider> tag
*/
export const TeamContextProvider = ({ children }) => {

  // apply useReducer(the function, the initial value for the state)
  const [state, dispatch] = useReducer(userReducer, { teams: [] });

  // this will cover the context section to the index.js <App /> tag
  return (
    // we then put value argument -> state: the current value here -> dispatch: the funct that will help sending the {type,payload}
    <TeamContext.Provider value={{ ...state, dispatch }}>
      {children} 
    </TeamContext.Provider>
  );
};
