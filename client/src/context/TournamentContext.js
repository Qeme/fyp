// import createContext from react
import { createContext, useReducer } from "react";

// declare a constant variable to hold the createContext funtion
// export it as well
export const TournamentContext = createContext()

// this is the function that we pass to the useReducer
// state is the value that you are currently working on
// {{type: 'SET_TOURNAMENTS', payload: tournaments / book: { title: A , author: B }}} which all are action
export const tournamentReducer = (state,action) => {
    switch(action.type){
        case 'SET_TOURNAMENTS':
            return {
                // just put back the value of tournaments to the tournaments list ... lol
                tournaments: action.payload
            }
        case 'CREATE_TOURNAMENT':
            return {
                // action.payload where we access the value that being passed using dispatch
                // ...state.tournaments is basically set up the current value (if not mentioned, it will completely replaced the original one)
                tournaments: [action.payload, ...state.tournaments]
            }
        case 'DELETE_TOURNAMENT':
            return {
                // the tournaments value will be replaced by using filter->only take the tournaments that id is not same with the id that is being
                tournaments: state.tournaments.filter((tournaments) => tournaments._id !== action.payload._id)
            }            
        default:
            // send back the state if no case is run
            return state
    }
}
// declare a constant variable to hold the context provider
// export it as well, take the children argument and insert it into <Provider> tag
export const TournamentContextProvider = ({ children }) => {

    // apply useReducer here the useState, but we need to put funct as first argument to handle the state
    const [state, dispatch] = useReducer(tournamentReducer, { tournaments : null } )

    // this will cover the context section to the index.js <App /> tag
    return (
        // we then put value argument -> state: the current value here -> dispatch: the funct that will help sending the {type,payload}
        <TournamentContext.Provider value={{...state, dispatch}}>
            {/* put the App into the children , however value is not provided yet to pass to App*/}
            { children }
        </TournamentContext.Provider>
    )

}