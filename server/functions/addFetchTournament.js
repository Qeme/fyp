import TournamentOrganizer from 'tournament-organizer';
const org = new TournamentOrganizer()

export function addFetchTournament(tournament){

    const tourney ={
        id: tournament.tour_id,
        name: tournament.name,
        stageOne: tournament.setting.stageOne,
        stageTwo: tournament.setting.stageTwo,
        round: tournament.setting.round,
        colored: tournament.setting.colored,
        sorting: tournament.setting.sorting,
        scoring: tournament.setting.scoring,
        players: tournament.setting.players,
        matches: tournament.setting.matches,
        meta: tournament.meta,
        status: tournament.setting.status
    }
    
    return org.reloadTournament(tourney);
}