import { useState } from 'react'
import { useWorkoutContext } from '../hooks/useWorkoutContext'

const WorkoutForm = () =>{
    // take the dispatch components from the hooks
    const { dispatch } = useWorkoutContext()
    // set up the useState for 3 properties
    const [title,setTitle] = useState('')
    const [load,setLoad] = useState('')
    const [reps,setReps] = useState('')
    // add additional state for emptyFields
    const [emptyFields, setEmptyFields] = useState([])

    // now, to handle error message, we might use useState as well
    const [error,setError] = useState(null)

    /*  here is the other function handleSubmit to manage submit button
        we use the async to handle API
     */
    const handleSubmit = async (e) =>{
        // prevent from by default to refresh the page
        e.preventDefault()

        // take those 3 variables that already being altered in the form
        const workout = {title, load, reps}

        // fetch the data to db to create
        const response = await fetch('http://localhost:3002/api/workouts',{
            /*  1. we add method POST, cause it is to create workout
                2. body must include the workout as json format...so we use JSON.stringify
                3. header with content-type as JSON
            */
            method: 'POST',
            body: JSON.stringify(workout),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        // basically we take back the json from the server to here...maybe we can do something about it idk
        // if we got error as well, it will be return into json
        const json = await response.json()

        if(!response.ok){
            // take the json error message and change the error variable
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }
        if(response.ok){
            // after all done, reset all the variables including error 
            setTitle('')
            setLoad('')
            setReps('')
            setError(null)
            // if no error, set back the EmptyFields to empty array
            setEmptyFields([])

            // checking 
            console.log("New workout inserted ",json)

            // now call the dispatch from useWorkoutContext hook to create new workout
            // we put payload : json as value because json has body of workout: { title, load, reps }
            dispatch({type: 'CREATE_WORKOUT', payload: json})
        }

    }

    return (
        <form className='create' onSubmit={handleSubmit}>
            <h3>Add A New Workout</h3>

            <label>Title Workout: </label>
            {/* onChange where e is event, when it is changed from null to certain value, we take the e.target.value
                value={title} it takes the value from title that currently null */}
            <input 
                type="text"
                onChange={(e)=> setTitle(e.target.value)}
                value={title}
                // setup the input className into error if there is error
                // if the emptyFields includes 'title' then we make the className into 'error' if not ''
                className={emptyFields.includes('title') ? 'error' : ''}
            />

            <label>Load (in Kg): </label>
            <input 
                type="number"
                onChange={(e)=> setLoad(e.target.value)}
                value={load}
                className={emptyFields.includes('load') ? 'error' : ''}
            />

            <label>Reps : </label>
            <input 
                type="number"
                onChange={(e)=> setReps(e.target.value)}
                value={reps}
                className={emptyFields.includes('reps') ? 'error' : ''}
            />

            {/* as you can see, there is no need to put action="" inside form tag,
                we just need to create onSubmit function 
                For this case we create handleSubmit func where it will be triggered when Add Workout button is clicked*/}
            
            <button>Add Workout</button>

            {/* to see the error down there
                Description: {error && ...}: This is a JavaScript logical AND operator (&&). 
                            It checks if the error variable has a truthy value.
                            If error is truthy (i.e., not null, undefined, 0, false, or an empty string), 
                            the expression evaluates to true. Otherwise, it evaluates to false. */}
            {error && <div className='error'>{error}</div>}
        </form>
    )
}

export default WorkoutForm