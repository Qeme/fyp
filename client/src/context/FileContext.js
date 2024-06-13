import { createContext, useReducer } from "react";

/* 
  declare a constant variable to hold the createContext funtion
  export it as well so it can be used by the custom hook useFileContext
*/
export const FileContext = createContext();

/*
  this is a function that will apply the useReducer()
  useReducer() is helping the by organizing and scaling the code when too many useState is being used
  just remember useReducer is like a condition logic where repetetitive or complex one can be here

  state is the value that you are currently working on (files in this case)
  action is {{type: 'SET_FILES', payload: files / book: { title: A , author: B }}} 
*/
export const fileReducer = (state, action) => {
  switch (action.type) {
    case "SET_FILES":
      return {
        ...state, //please do not forget to spread the state
        files: action.payload, //this part basically SETTING UP the files value
      }; 
    case "UPLOAD_FILE":
      return {
        ...state,
        files: [action.payload, ...state.files], // ...state.files is basically set up the current value (if not mentioned, it will completely replaced the original one)
      };
    case "REMOVE_FILE":
      return {
        ...state,
        files: state.files.filter((file) => file._id !== action.payload._id),  // the files value will be replaced by using filter->only take the files that id is not same with the id that is being
      };
    default:
      return state; // send back the state if no case is run (ESSENTIAL)
  }
};

/* 
  declare a constant variable to hold the useContext (FileContext) provider
  export it as well, take the children argument and insert it into <Provider> tag
*/
export const FileContextProvider = ({ children }) => {

  // apply useReducer(the function, the initial value for the state)
  const [state, dispatch] = useReducer(fileReducer, { files: [] });

  // this will cover the context section to the index.js <App /> tag
  return (
    // we then put value argument -> state: the current value here -> dispatch: the funct that will help sending the {type,payload}
    <FileContext.Provider value={{ ...state, dispatch }}>
      {children} 
    </FileContext.Provider>
  );
};
