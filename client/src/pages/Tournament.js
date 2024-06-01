// remove the useState as we know use the hooks
import { useEffect } from "react"

// import the hooks that involve with TournamentContext
import { useTournamentContext } from "../hooks/useTournamentContext";

// import components
import TournamentDetails from "../components/TournamentDetails";
import TournamentForm from "../components/TournamentForm";

// create a function Tournament to return a page with what you want
const Tournament = () => {
    // use {} to destructure 
    const { tournaments, dispatch } = useTournamentContext()
    
    // call the useEffect hook
    // second argument [] because we want to run it once
    useEffect(() => {
        // create an async function to fetch the data
        const fetchTournament = async () => {
            try {
                // create a variable to fetch
                const response = await fetch('http://localhost:3002/api/tournaments/');
                // take the user input and pass it as json
                const json = await response.json()

                // check if response is ok or not
                if (response.ok) {
                    // instead of using the setTournament, we just put dispatch
                    dispatch({type: 'SET_TOURNAMENTS', payload: json})
                    
                } else {
                    console.error('Error fetching tournaments:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching tournaments:', error);
            }
        };
    
        // call the function
        fetchTournament();
    }, [dispatch]);
    

    // this is what will be presented to the page when called
    return (
        <div className="home">
            <div className="tournaments">
                {/* iterate all the tournaments that you have found where tournaments ISNT NULL
                    we also use () instead of {} because we return a template */}
                {tournaments && tournaments.map((tournament)=>(
                    // we use key for unique properties only & to optimize the rendering process and taking tournament parameter as well
                    <TournamentDetails key={tournament._id} tournament={tournament}/>
                ))}
            </div>
            <TournamentForm />
        </div>
    )
}

// export the Tournament function
export default Tournament