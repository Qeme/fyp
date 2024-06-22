// call the tournaments collection
import tournamentDB from "../models/tournamentModel.js";
// to handle _id format (if u use it), need to import back mongoose
import mongoose from "mongoose";
import roundDB from "../models/roundModel.js";
import { removeFetchTournament } from "../functions/removeFetchTournament.js";
import { addFetchTournament } from "../functions/addFetchTournament.js";
import { updateFetchToDatabase } from "../functions/updateFetchToDatabase.js";
import { org } from "../index.js";

// get all tournaments
export const getAllTournaments = async (req, res) => {
  try {
    const tournaments = await tournamentDB.find({}).sort({ createdAt: -1 });
    res.status(200).json(tournaments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get a tournament
export const getATournament = async (req, res) => {
  // there is a params value which is id
  const { id } = req.params;

  // check if the id inserted inside params are actually followed the _id format, return if it is invalid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such tournament in database" });
  }

  const tournament = await tournamentDB.findById(id);

  // if no tournament found by that id, we need to return the function so that it will not proceed
  if (!tournament) {
    return res.status(404).json({ error: "No such tournament in database" });
  }

  res.status(200).json(tournament);
};

// get the list of status tournaments ('created','published','running','finished')
export const getStatusTournaments = async (req, res) => {
  const { status } = req.body;

  try {
    const tournaments = await tournamentDB
      .find({ "meta.status": status })
      .sort({ createdAt: -1 });
    res.status(200).json(tournaments);
  } catch (error) {
    res.status(400).json({ error: "No such published tournament in database" });
  }
};

// get the standing players inside the particular tournament
export const getStandingTournament = async (req, res) => {
  const { id } = req.params;

  try {
    const tournament = await tournamentDB.findById(id);
    const tour = addFetchTournament(tournament);

    // improve later ...
    const ranking = tour.standings();

    res.status(200).json(ranking);
  } catch (error) {
    res
      .status(400)
      .json({
        error: `Deny Permission: Assign . Additional info : ${error.message}`,
      });
  }
};

// post the tournament from "created" to "published"
export const publishTournament = async (req, res) => {
  // there is a params value which is id
  const { id } = req.params;

  try {
    const updatedTournament = await tournamentDB.findByIdAndUpdate(id, {
      $set: { "meta.status": "published" },
    });
    res.status(200).json(updatedTournament);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// post new tournament
export const createTournament = async (req, res) => {
  const {
    name,
    game_id,
    venue_id,
    stageOne,
    stageTwo,
    register,
    running,
    checkin,
    notification,
    ticket,
    representative,
    colored,
    sorting,
    scoring,
  } = req.body;
  // grab the req.user from the middleware 'requireAuth.js' before we pass it into find argument
  const user = req.user;

  // check the field that is empty
  let emptyFields = [];

  if(stageTwo.format === ""){
    stageTwo.format = null
  }
  
  // so for each field that empty, push the field properties to the array
  if (!name) {
    emptyFields.push("name");
  }
  if (emptyFields.length > 0) {
    // if the emptyFields have value, we return universal error message means we avoid the system from continuing/proceeding
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  try {
    // use Tournament module to create the tournament, then pass the id to mongodb database
    const tour = org.createTournament(name, {
      stageOne,
      stageTwo,
      colored,
      sorting,
      scoring,
      meta: {
        organizer_id: user._id,
        game_id,
        venue_id,
        register,
        running,
        checkin,
        notification,
        ticket,
        representative,
      },
    });

    // use .create() to generate and save the data
    const tournament = await tournamentDB.create({
      tour_id: tour.id,
      name: tour.name,
      setting: {
        stageOne: tour.stageOne,
        stageTwo: tour.stageTwo,
        colored: tour.colored,
        sorting: tour.sorting,
        scoring: tour.scoring,
        status: tour.status,
        round: tour.round,
        players: tour.players,
        matches: tour.matches,
      },
      meta: tour.meta,
    });

    // clean up the fetch tour
    removeFetchTournament();

    res.status(200).json(tournament);
  } catch (error) {
    res
      .status(400)
      .json({
        error: `Tournament can't be created. Additional info: ${error.message}`,
      });
  }
};

// assign players/...referee to the tournament that recently created
export const assignTournament = async (req, res) => {
  const { id } = req.params;
  const { players, referees } = req.body;

  const tournament = await tournamentDB.findById(id);

  try {
    // update referees
    for (const referee of referees) {
      await tournamentDB.updateOne(
        { _id: id },
        { $push: { "meta.referee_id": { id: referee._id } } }
      );
    }

    const tour = addFetchTournament(tournament);

    // create player to the tour
    players.map((player) => {
      tour.createPlayer(player.name, player._id);
    });

    // update the tournament DB
    const updatedTournament = await updateFetchToDatabase(tour.id, tour);

    // after done, remove the tournament fetch data
    removeFetchTournament();

    res.status(200).json(updatedTournament);
  } catch (error) {
    res.status(400).json({ error: "Deny Permission: Assign" });
  }
};

// start a tournament
export const startTournament = async (req, res) => {
  const { id } = req.params;

  const tournament = await tournamentDB.findById(id);
  const bestOf = tournament.setting.scoring.bestOf;

  try {
    // reload the tour fetch by the tournamentinfo DB
    const tour = addFetchTournament(tournament);

    // start the tour
    tour.start();

    // after start, change status from 'published' to 'running'
    tour.meta.status = "running";

    // generate the match after starting the tournament
    tour.matches.map(async (match) => {
      // use .create() to generate and save the data
      await roundDB.create({
        match_id: match.id,
        bestOf: bestOf,
        p1: match.player1.id,
        p2: match.player2.id,
        scoreP1: new Array(bestOf).fill(0),
        scoreP2: new Array(bestOf).fill(0),
      });
    });

    // update the tournament DB
    const updatedTournament = await updateFetchToDatabase(tour.id, tour);

    // after done, remove the tournament fetch data
    removeFetchTournament();

    res.status(200).json(updatedTournament);
  } catch (error) {
    res.status(400).json({ error: "Deny Permission: Start" });
  }
};

// end a tournament
export const endTournament = async (req, res) => {
  const { id } = req.params;

  const tournament = await tournamentDB.findById(id);

  try {
    // reload the tour fetch by the tournamentinfo DB
    const tour = addFetchTournament(tournament);

    // end the tour
    tour.end();

    // after ending the tour, change status from 'running' to 'finished'
    tour.meta.status = "finished";

    // update the tournament DB
    const updatedTournament = await updateFetchToDatabase(tour.id, tour);

    // after done, remove the tournament fetch data
    removeFetchTournament();

    res.status(200).json(updatedTournament);
  } catch (error) {
    res.status(400).json({ error: "Deny Permission: End" });
  }
};

// delete a tournament
export const deleteTournament = async (req, res) => {
  // there is a params value which is id
  const { id } = req.params;

  // check if the id inserted inside params are actually followed the _id format, return if it is invalid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such tournament in database" });
  }

  // use .findOneAndDelete and put the parameter as _id that equal to id
  const tournament = await tournamentDB.findOneAndDelete({ _id: id });

  // if no tournament found by that id, we need to return the function so that it will not proceed
  if (!tournament) {
    return res.status(404).json({ error: "No such tournament in database" });
  }

  res.status(200).json(tournament);
};

// patch a tournament
export const updateTournament = async (req, res) => {
  // there is a params value which is id
  const { id } = req.params;
  // get the json body to update as well

  // check if the id inserted inside params are actually followed the _id format, return if it is invalid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such tournament in database" });
  }

  // use .findOneAndDelete and put the parameter as _id that equal to id
  // second argument is the value/body that you want to pass and update
  const tournament = await tournamentDB.findOneAndUpdate(
    { _id: id },
    {
      /*
        req.body typically refers to the body of a request in an Express.js application. 
        When you use req.body, you're accessing the body of the HTTP request that the client sends to your server.

        On the other hand, ...req.body is a JavaScript syntax for object spreading. It spreads the properties of req.body into a new object. 
        This can be useful if you want to clone or merge the properties of req.body into another object. It will not affect the original req.body
        */
      ...req.body,
    },
    {new: true} //give the updated one
  );

  // if no tournament found by that id, we need to return the function so that it will not proceed
  if (!tournament) {
    return res.status(404).json({ error: "No such tournament in database" });
  }

  res.status(200).json(tournament);
};
