// import createContext from react
import { createContext, useEffect, useReducer } from "react";

// declare a constant variable to hold the createContext funtion
// export it as well
export const AuthContext = createContext()

// this is the function that we pass to the useReducer
export const authReducer = (state,action) => {
    switch(action.type){
        case 'LOGIN':
            return {
                // just put back the value of user to the user ... lol
                user : action.payload
            }
        case 'LOGOUT':
            return {
                // reset the user to null as they already log out from the system
                user : null
            }       
        default:
            // send back the state if no case is run
            return state
    }
}
// declare a constant variable to hold the context provider
// export it as well, take the children argument and insert it into <Provider> tag
export const AuthContextProvider = ({ children }) => {

    // apply useReducer here the useState, but we need to put funct as first argument to handle the state
    const [state, dispatch] = useReducer(authReducer, { user  : null } )

    // add useEffect() that run once, means it will check the localStorage first (because it doesnt disappear when user refresh the page/close the tab)
    useEffect(() => {
        // grab the data from the localStorage if there is one
        const user = JSON.parse(localStorage.getItem("user"))

        // if it really exist, we call back the dispatch to LOGIN, basically set up back the user context data
        if(user){
            dispatch({type: 'LOGIN', payload: user})
        }
    }, []) 

    // print the console.log to see the user state for debugging later on
    console.log('Authentication State: ',state)

    // this will cover the context section to the index.js <App /> tag
    return (
        // we then put value argument -> state: the current value here -> dispatch: the funct that will help sending the {type,payload}
        <AuthContext.Provider value={{...state, dispatch}}>
            {/* put the App into the children , however value is not provided yet to pass to App*/}
            { children }
        </AuthContext.Provider>
    )

}