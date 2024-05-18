// call the useWorkoutContext hook
import { useWorkoutContext } from "../hooks/useWorkoutContext"
// call date-fns package
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

// create the function WorkoutDetails
// taking each workout value from the Home.js
const WorkoutDetails = ({workout})=>{

    // grab the dispatch fron useWorkoutContext
    const { dispatch } = useWorkoutContext()

    // handleClick will handle the delete function backend and frontend
    const handleClick = async () => {
        const response = await fetch('http://localhost:3002/api/workouts/' + workout._id,{
            // remember to put API method
            method: 'DELETE'
        })
        
        // the json also need to wait for the response to finish execute the fetch before it can received them
        const json = await response.json()

        // when fetching done, then we remove the workout detail to frontend
        if (response.ok) {
            // json as the data is there, if not found, then no delete
            dispatch({type: 'DELETE_WORKOUT', payload: json })
        }
    }

    // just return to output the section
    return (
        <div className="workout-details">
        <h4>{workout.title}</h4>
        <p><strong>Load(Kg): </strong>{workout.load}</p>
        <p><strong>Reps: </strong>{workout.reps}</p>
        {/* instead of just showing the string of the date, u can use the date-fns to format them */}
        <p>{formatDistanceToNow( new Date(workout.createdAt), { addSuffix: true } )}</p> 
        <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
        </div>
    )
}

// export the function
export default WorkoutDetails