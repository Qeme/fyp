import { createContext, useReducer } from "react";

/* 
  declare a constant variable to hold the createContext funtion
  export it as well so it can be used by the custom hook useUserContext
*/
export const UserContext = createContext();

/*
  this is a function that will apply the useReducer()
  useReducer() is helping the by organizing and scaling the code when too many useState is being used
  just remember useReducer is like a condition logic where repetetitive or complex one can be here

  state is the value that you are currently working on (users in this case)
  action is {{type: 'SET_USERS', payload: users / book: { title: A , author: B }}} 
*/
export const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USERS":
      return {
        ...state, //please do not forget to spread the state
        users: action.payload, //this part basically SETTING UP the users value
      }; 
      case "CREATE_USER":
      return {
        ...state,
        users: [action.payload, ...state.users], // ...state.users is basically set up the current value (if not mentioned, it will completely replaced the original one)
      };
    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user //updating the user based on its id, if found replace, if not just put it back
        ),
      };
    case "DELETE_USER":
      return {
        ...state,
        users: state.users.filter((user) => user._id !== action.payload._id),  // the users value will be replaced by using filter->only take the user that id is not same with the id that is being
      };
    default:
      return state; // send back the state if no case is run (ESSENTIAL)
  }
};

/* 
  declare a constant variable to hold the useContext (UserContext) provider
  export it as well, take the children argument and insert it into <Provider> tag
*/
export const UserContextProvider = ({ children }) => {

  // apply useReducer(the function, the initial value for the state)
  const [state, dispatch] = useReducer(userReducer, { users: [] });

  // this will cover the context section to the index.js <App /> tag
  return (
    // we then put value argument -> state: the current value here -> dispatch: the funct that will help sending the {type,payload}
    <UserContext.Provider value={{ ...state, dispatch }}>
      {children} 
    </UserContext.Provider>
  );
};
