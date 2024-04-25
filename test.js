import TournamentOrganizer from 'tournament-organizer';
const org = new TournamentOrganizer()
let tournament
let player

tournament = org.createTournament("A",{},"123")

player = tournament.createPlayer("Omar","456")
player.value = 10
player = tournament.createPlayer("Azman","787")
player.value = 8
player = tournament.createPlayer("Popa","111")
player.value = 6
player = tournament.createPlayer("Ali","22")
player.value = 2
// player = tournament.createPlayer("Kumar","114")
// player = tournament.createPlayer("Olah","345")

console.log("11111111111111111111",tournament)

try{
    tournament.start()
}catch(err){
    console.error("Error: "+err)
}

console.log('222222222222222222',tournament)

// console.log("Player ",tournament.players[1].matches)
// console.log("Match before",tournament.matches[0].player1)
// console.log("Match before",tournament.matches[0].player2)

// tournament.enterResult(tournament.matches[0].id,3,0,0)

// console.log("Match after",tournament.matches[0].player1)
// console.log("Match after",tournament.matches[0].player2)

// console.log(tournament.standings())
// // this to see overall players

// console.log("Player 1 Before")
// tournament.matches.forEach(match => console.log(match.player1))

// console.log("Player 2 Before")
// tournament.matches.forEach(match => console.log(match.player2))

// tournament.enterResult(tournament.matches[0].id,3,0,0)
// tournament.enterResult(tournament.matches[1].id,1,2,0)
// tournament.enterResult(tournament.matches[2].id,2,1,0)
// tournament.enterResult(tournament.matches[3].id,2,1,0)
// tournament.enterResult(tournament.matches[4].id,3,0,0)
// tournament.enterResult(tournament.matches[5].id,0,3,0)

// console.log("Player 1 After")
// tournament.matches.forEach(match => console.log(match.player1))

// console.log("Player 2 After")
// tournament.matches.forEach(match => console.log(match.player2))

// tournament.enterResult(tournament.matches[2].id,2,1,0)
// tournament.enterResult(tournament.matches[3].id,3,0,0)
// tournament.enterResult(tournament.matches[4].id,2,3,0)

// console.log("Player 1 After after")
// tournament.matches.forEach(match => console.log(match.player1))

// console.log("Player 2 After after")
// tournament.matches.forEach(match => console.log(match.player2))

// console.log("Pre-Tournament")
// tournament.matches.forEach(match => console.log("Match ",match.id," P1 [",match.player1.id,"] VS P2 [",match.player2.id,"]"))

// tournament.enterResult(tournament.matches[0].id,2,1,0)
// tournament.enterResult(tournament.matches[1].id,2,1,0)

console.log("Post-Tournament")
tournament.matches.forEach(match => console.log("Match :",match.match," Round :",match.round," P1 [",match.player1.id,"] (",match.player1.win,") VS P2 [",match.player2.id,"] (",match.player2.win,")"))

tournament.enterResult(tournament.matches[0].id,3,2,0)

console.log("Final Tournament")
tournament.matches.forEach(match => console.log("Match :",match.match," Round :",match.round," P1 [",match.player1.id,"] (",match.player1.win,") VS P2 [",match.player2.id,"] (",match.player2.win,")"))

console.log('333333333333333333333333',tournament)

////////////////////////////////////////////////////////////////////////////////////////////////////////

// console.log("Pre-Tournament")
// tournament.matches.forEach(match => console.log("Match ",match.id," P1 [",match.player1.id,"] VS P2 [",match.player2.id,"]"))

// tournament.enterResult(tournament.matches[0].id,3,0,0)
// tournament.enterResult(tournament.matches[1].id,1,1,1)
// // tournament.enterResult(tournament.matches[2].id,2,1,0)
// // tournament.enterResult(tournament.matches[3].id,2,1,0)
// // tournament.enterResult(tournament.matches[4].id,3,0,0)
// // tournament.enterResult(tournament.matches[5].id,0,3,0)

// // tournament.enterResult(tournament.matches[0].id,2,1,0)
// // tournament.enterResult(tournament.matches[1].id,3,0,0)

// // tournament.next()
// // tournament.enterResult(tournament.matches[2].id,1,2,0)
// // tournament.enterResult(tournament.matches[3].id,2,1,0)

// console.log("Post-Tournament")
// tournament.matches.forEach(match => console.log("Match :",match.match," Round :",match.round," P1 [",match.player1.id,"] (",match.player1.win,") VS P2 [",match.player2.id,"] (",match.player2.win,")"))

// // tournament.next()
// // tournament.enterResult(tournament.matches[4].id,3,0,0)
// // tournament.enterResult(tournament.matches[5].id,0,3,0)

// // console.log("Final Tournament")
// // tournament.matches.forEach(match => console.log("Match :",match.match," Round :",match.round," P1 [",match.player1.id,"] (",match.player1.win,") VS P2 [",match.player2.id,"] (",match.player2.win,")"))

// // tournament.next()
// // console.log(tournament)
// // console.log("Single-elimination")
// // tournament.enterResult(tournament.matches[6].id,2,3,0)
// // tournament.matches.forEach(match => console.log("Match :",match.match," Round :",match.round," P1 [",match.player1.id,"] (",match.player1.win,") VS P2 [",match.player2.id,"] (",match.player2.win,")"))


// // tournament.enterResult(tournament.matches[2].id,3,2,0)
// // try{
// //     tournament.enterResult(tournament.matches[4].id,0,3,0)
// //     tournament.enterResult(tournament.matches[5].id,0,3,0)
// // }catch(err){
// //     console.error(err.message)
// // }


// // console.log("Semi Final")
// // tournament.matches.forEach(match => console.log("Match ",match.id," P1 [",match.player1.id,"] (",match.player1.win,") VS P2 [",match.player2.id,"] (",match.player2.win,")"))

// // console.log("Final")
// // tournament.enterResult(tournament.matches[3].id,2,3,0)
// // tournament.matches.forEach(match => console.log("Match ",match.id," P1 [",match.player1.id,"] (",match.player1.win,") VS P2 [",match.player2.id,"] (",match.player2.win,")"))

// // console.log(tournament)

// console.log(tournament.standings())

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

