// remove the useState as we know use the hooks
import { useEffect } from "react"

// import the hooks that involve with WorkoutContext
import { useWorkoutContext } from "../hooks/useWorkoutContext";

// import components
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";

// create a function Home to return a page with what you want
const Home = () => {
    // use {} to destructure 
    const { workouts, dispatch } = useWorkoutContext()
    
    // call the useEffect hook
    // second argument [] because we want to run it once
    useEffect(() => {
        // create an async function to fetch the data
        const fetchWorkout = async () => {
            try {
                // create a variable to fetch
                const response = await fetch('http://localhost:3002/api/workouts');
                // take the user input and pass it as json
                const json = await response.json()

                // check if response is ok or not
                if (response.ok) {
                    // instead of using the setWorkout, we just put dispatch
                    dispatch({type: 'SET_WORKOUTS', payload: json})
                    
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
                {workouts && workouts.map((workout)=>(
                    // we use key for unique properties only & to optimize the rendering process and taking workout parameter as well
                    <WorkoutDetails key={workout._id} workout={workout}/>
                ))}
            </div>
            <WorkoutForm />
        </div>
    )
}

// export the Home function
export default Home