// call the useTournamentContext hook
import { Link } from "react-router-dom"
import { useTournamentContext } from "../hooks/useTournamentContext"
// call date-fns package
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

// create the function TournamentDetails
// taking each tournament value from the Tournament.js
const TournamentDetails = ({tournament})=>{

    // grab the dispatch fron useTournamentContext
    const { dispatch } = useTournamentContext()

    // handleClick will handle the delete function backend and frontend
    const handleClick = async () => {
        const response = await fetch('http://localhost:3002/api/tournaments/' + tournament._id,{
            // remember to put API method
            method: 'DELETE'
        })
        
        // the json also need to wait for the response to finish execute the fetch before it can received them
        const json = await response.json()

        // when fetching done, then we remove the tournament detail to frontend
        if (response.ok) {
            // json as the data is there, if not found, then no delete
            dispatch({type: 'DELETE_TOURNAMENT', payload: json })
        }
    }

    // just return to output the section
    return (
        <div className="tournament-details">
        <h4>
            <Link to={`/tournament/${tournament._id}`} className="tournament-link">
                {tournament.name}
            </Link>
        </h4>
        <p><strong>Representative: </strong>{tournament.meta.representative.repType}</p>
        <p><strong>Best Of: </strong>{tournament.setting.scoring.bestOf}</p>
        {/* <p><strong>Load(Kg): </strong>{tournament.load}</p>
        <p><strong>Reps: </strong>{tournament.reps}</p> */}
        {/* instead of just showing the string of the date, u can use the date-fns to format them */}
        <p>{formatDistanceToNow( new Date(tournament.createdAt), { addSuffix: true } )}</p> 
        <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
        </div>
    )
}

// export the function
export default TournamentDetails