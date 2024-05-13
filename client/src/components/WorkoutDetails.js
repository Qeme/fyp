// create the function WorkoutDetails
// taking each workout value from the Home.js
const WorkoutDetails = ({workout})=>{

    // just return to output the section
    return (
        <div className="workout-details">
        <h4>{workout.title}</h4>
        <p><strong>Load(Kg): </strong>{workout.load}</p>
        <p><strong>Reps: </strong>{workout.reps}</p>
        <p>{workout.createdAt}</p>
        </div>
    )
}

// export the function
export default WorkoutDetails