import { useState } from 'react'
import { useTournamentContext } from '../hooks/useTournamentContext'

const TournamentForm = () =>{
    // take the dispatch components from the hooks
    const { dispatch } = useTournamentContext()
    // set up the useState for 3 properties
    const [name,setName] = useState('')
    // const [load,setLoad] = useState('')
    // const [reps,setReps] = useState('')

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
        const tournament = {name}

        // fetch the data to db to create
        const response = await fetch('http://localhost:3002/api/tournaments/',{
            /*  1. we add method POST, cause it is to create tournament
                2. body must include the tournament as json format...so we use JSON.stringify
                3. header with content-type as JSON
            */
            method: 'POST',
            body: JSON.stringify(tournament),
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
            setName('')
            // setLoad('')
            // setReps('')
            setError(null)
            // if no error, set back the EmptyFields to empty array
            setEmptyFields([])

            // checking 
            console.log("New tournament inserted ",json)

            // now call the dispatch from useTournamentContext hook to create new tournament
            // we put payload : json as value because json has body of tournament: { name }
            dispatch({type: 'CREATE_TOURNAMENT', payload: json})
        }

    }

    return (
        <form className='create' onSubmit={handleSubmit}>
            <h3>Add A New Tournament</h3>

            <label>Name Tournament: </label>
            {/* onChange where e is event, when it is changed from null to certain value, we take the e.target.value
                value={name} it takes the value from name that currently null */}
            <input 
                type="text"
                onChange={(e)=> setName(e.target.value)}
                value={name}
                // setup the input className into error if there is error
                // if the emptyFields includes 'name' then we make the className into 'error' if not ''
                className={emptyFields.includes('name') ? 'error' : ''}
            />

            {/* <label>Load (in Kg): </label>
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
            /> */}

            {/* as you can see, there is no need to put action="" inside form tag,
                we just need to create onSubmit function 
                For this case we create handleSubmit func where it will be triggered when Add Tournament button is clicked*/}
            
            <button>Add Tournament</button>

            {/* to see the error down there
                Description: {error && ...}: This is a JavaScript logical AND operator (&&). 
                            It checks if the error variable has a truthy value.
                            If error is truthy (i.e., not null, undefined, 0, false, or an empty string), 
                            the expression evaluates to true. Otherwise, it evaluates to false. */}
            {error && <div className='error'>{error}</div>}
        </form>
    )
}

export default TournamentForm