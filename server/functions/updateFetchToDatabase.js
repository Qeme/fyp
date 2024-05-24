import tournamentDB from '../models/tournamentModel.js';

export async function updateFetchToDatabase(id, tour){

    const updateDetail = {
        'setting.players' : tour.players,
        'setting.matches' : tour.matches,
        'setting.status' : tour.status,
        'setting.stageOne' : tour.stageOne,
        'setting.stageTwo' : tour.stageTwo,
        'setting.round' : tour.round,
        'setting.colored' : tour.colored,
        'setting.sorting' : tour.sorting,
        'setting.scoring' : tour.scoring,
        'meta.organizer_id' : tour.meta.organizer_id,
        'meta.game_id' : tour.meta.game_id,
        'meta.venue_id' : tour.meta.venue_id,
        'meta.register' : tour.meta.register,
        'meta.running' : tour.meta.running,
        'meta.checkin' : tour.meta.checkin,
        'meta.notification' : tour.meta.notification,
        'meta.ticket' : tour.meta.ticket,
        'meta.representative' : tour.meta.representative,
        'meta.status': tour.meta.status,
        'meta.referee_id' : tour.meta.referee_id,
        'meta.spectator_id' : tour.meta.referee_id
};

    return await tournamentDB.findOneAndUpdate({ tour_id : id }, { $set: updateDetail }, { new: true });
}