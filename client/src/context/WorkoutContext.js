// import createContext from react
import { createContext, useReducer } from "react";

// declare a constant variable to hold the createContext funtion
// export it as well
export const WorkoutContext = createContext()

// this is the function that we pass to the useReducer
// state is the value that you are currently working on
// {{type: 'SET_WORKOUTS', payload: workouts / book: { title: A , author: B }}} which all are action
export const workoutReducer = (state,action) => {
    switch(action.type){
        case 'SET_WORKOUTS':
            return {
                // just put back the value of workouts to the workouts ... lol
                workouts: action.payload
            }
        case 'CREATE_WORKOUT':
            return {
                // action.payload where we access the value that being passed using dispatch
                // ...state.workouts is basically set up the current value (if not mentioned, it will completely replaced the original one)
                workouts: [action.payload, ...state.workouts]
            }
        case 'DELETE_WORKOUT':
            return {
                // the workouts value will be replaced by using filter->only take the workout that id is not same with the id that is being
                workouts: state.workouts.filter((workout) => workout._id !== action.payload._id)
            }            
        default:
            // send back the state if no case is run
            return state
    }
}
// declare a constant variable to hold the context provider
// export it as well, take the children argument and insert it into <Provider> tag
export const WorkoutContextProvider = ({ children }) => {

    // apply useReducer here the useState, but we need to put funct as first argument to handle the state
    const [state, dispatch] = useReducer(workoutReducer, { workouts : null } )

    // this will cover the context section to the index.js <App /> tag
    return (
        // we then put value argument -> state: the current value here -> dispatch: the funct that will help sending the {type,payload}
        <WorkoutContext.Provider value={{...state, dispatch}}>
            {/* put the App into the children , however value is not provided yet to pass to App*/}
            { children }
        </WorkoutContext.Provider>
    )

}