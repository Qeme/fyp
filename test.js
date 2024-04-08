import TournamentOrganizer from 'tournament-organizer';
const org = new TournamentOrganizer()
let tournament
let player

// Define the Player object structure
function Player(id, name) {
    this.id = id;
    this.name = name;
    // Add other properties as needed
}

// Example usage
const players = [];

// Adding players to the array
const player1 = new Player("1", "Alice");
const player2 = new Player("2", "Bob");

players.push(player1);
players.push(player2);

tournament = org.createTournament("A",{
    players: [players]
},"123")

console.log(tournament)

player = tournament.createPlayer("Omar","456")

console.log("HOIIIIIIIIIIIi "+player)
console.log(tournament)

try{
    tournament.start()
}catch(err){
    console.error("Error: "+err)
}
