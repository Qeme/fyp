// import React hooks 
import { useState, useEffect } from "react"
// import components
import WorkoutDetails from "../components/WorkoutDetails";

// create a function Home to return a page with what you want
const Home = () => {
    // call the useState to have null value at first
    const [workouts, setWorkouts] = useState(null)
    // call the useEffect hook
    // second argument [] because we want to run it once
    useEffect(() => {
        // create an async function to fetch the data
        const fetchWorkout = async () => {
            try {
                // create a variable to fetch
                const response = await fetch('http://localhost:3002/api/workouts');
                
                // check if response is ok or not
                if (response.ok) {
                    // parse the JSON data
                    const json = await response.json();
                    
                    // if ok, set the workouts state to the JSON value returned by GET '/'
                    setWorkouts(json);
                } else {
                    console.error('Error fetching workouts:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching workouts:', error);
            }
        };
    
        // call the function
        fetchWorkout();
    }, []);
    

    // this is what will be presented to the page when called
    return (
        <div className="home">
            <div className="workouts">
                {/* iterate all the workouts that you have found where workouts ISNT NULL
                    we also use () instead of {} because we return a template */}
                {Array.isArray(workouts) && workouts.length > 0 && workouts.map((workout)=>(
                    // we use key for unique properties only & to optimize the rendering process and taking workout parameter as well
                    <WorkoutDetails key={workout._id} workout={workout}/>
                ))}
            </div>
        </div>
    )
}

// export the Home function
export default Home