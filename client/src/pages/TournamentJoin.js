import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTournamentContext } from "../hooks/useTournamentContext";
import TournamentAdvertise from "../components/TournamentAdvertise"
import TournamentBillboard from "../components/TournamentBillboard"

const TournamentJoin = () => {
    const { id } = useParams();
    const { tournament, dispatch } = useTournamentContext()

    useEffect(() => {
        const fetchTournament = async () => {
            try{
                const response = await fetch('http://localhost:3002/api/tournaments/' + id);
                const json = await response.json();

                if (response.ok) {
                    dispatch({ type: 'SET_TOURNAMENT_DETAILS', payload: json });
                } else {
                    console.error('Error fetching tournament details:', response.statusText);
                }
            }catch(error){
                console.error('Error fetching tournaments:', error);
            }
        
        };

        fetchTournament();
    }, [id, dispatch]);

  return (
    <div>
        <TournamentAdvertise tournament={tournament}/>
        <TournamentBillboard />
    </div>
    
  )
}

export default TournamentJoin