import { org } from "../index.js"

export function removeFetchTournament(){
    //do nested loop -> do remove the tournament inside the array of org.tournaments by using org.removeTournament()

    while(org.tournaments.length!=0){
        org.tournaments.map((tournament) => {
            console.log("Deleting..."+tournament.id)
            org.removeTournament(tournament.id)
        })
    }

}