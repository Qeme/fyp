import TournamentOrganizer from 'tournament-organizer';
const org = new TournamentOrganizer()
let tournament
let player

tournament = org.createTournament("A",{
    scoring:{bestOf:3},
    stageOne:{format:"round-robin"},
    stageTwo:{
        advance: {
            method: "All",
            value: 2
        },
        format:"single-elimination",
        consolation:true},
    sorting:"ascending"},"123")

player = tournament.createPlayer("Omar","A")
player.value = 10
player = tournament.createPlayer("Azman","D")
player.value = 8
player = tournament.createPlayer("Popa","B")
player.value = 6
player = tournament.createPlayer("Ali","C")
player.value = 4
// player = tournament.createPlayer("Zul","6")
// player.value = 3
// player = tournament.createPlayer("Harith","7")
// player.value = 2
// player = tournament.createPlayer("Kumar","8")
// player.value = 1
// player = tournament.createPlayer("Othman","9")
// player.value = 0
// player = tournament.createPlayer("Kumar","114")
// player = tournament.createPlayer("Olah","345")

// console.log("11111111111111111111",tournament)

try{
    tournament.start()
}catch(err){
    console.error("Error: "+err)
}

// console.log('222222222222222222',tournament)

console.log("Pre Tournament")
tournament.matches.forEach(match => console.log("Match :",match.match," Round :",match.round," P1 [",match.player1.id,"] (",match.player1.win,") VS P2 [",match.player2.id,"] (",match.player2.win,")"))

tournament.enterResult(tournament.matches[0].id,0,3,0)
// tournament.enterResult(tournament.matches[1].id,2,1,0)
// tournament.next()
// tournament.enterResult(tournament.matches[2].id,1,2,0)
// tournament.enterResult(tournament.matches[3].id,3,0,0)
// tournament.next()
// tournament.enterResult(tournament.matches[4].id,1,2,0)
// tournament.enterResult(tournament.matches[5].id,2,1,0)

console.log("Post Tournament")
tournament.matches.forEach(match => console.log("Match :",match.match," Round :",match.round," P1 [",match.player1.id,"] (",match.player1.win,") VS P2 [",match.player2.id,"] (",match.player2.win,")"))
console.log("Before\n",tournament.standings())

let x = {
    id: "333",
    name: tournament.name,
    matches : tournament.matches,
    meta: tournament.meta,
    players: tournament.players,
    round: tournament.round,
    scoring: tournament.scoring,
    sorting: tournament.sorting,
    stageOne: tournament.stageOne,
    stageTwo: tournament.stageTwo,
    status: tournament.status,
    colored: tournament.colored
}

let tournament1 = org.reloadTournament(x)
console.log("111111111111111111111111111111111111111",org.tournaments)

org.removeTournament("333")
console.log("333333333333333333333333333333333333333333333333",org.tournaments)

// tournament.next()
// // tournament.enterResult(tournament.matches[1].id,1,0,0)
// // tournament.assignLoss("B",1)
// // tournament.next()
// console.log("After Stage-One\n",tournament.standings())
// tournament.enterResult(tournament.matches[6].id,3,0,0)
// tournament.enterResult(tournament.matches[7].id,2,1,0)
// tournament.enterResult(tournament.matches[8].id,2,3,0)

// console.log("Stage-Two Tournament")
// tournament.matches.forEach(match => console.log("Match :",match.match," Round :",match.round," P1 [",match.player1.id,"] (",match.player1.win,") VS P2 [",match.player2.id,"] (",match.player2.win,")"))

// console.log("After Stage-Two\n",tournament.standings())
// console.log("Post Tournament")
// tournament.players.forEach(player => {
//     console.log("Player: ", player.name);
//     player.matches.forEach(match => {
//         console.log("Match ID: ",match.id);
//     });
// });



// tournament.enterResult(tournament.matches[2].id,3,0,0)
// tournament.assignLoss("22",2)
// tournament.enterResult(tournament.matches[3].id,2,1,0)

// tournament.enterResult(tournament.matches[4].id,0,3,0)

// console.log("Final Tournament")
// tournament.matches.forEach(match => console.log("Match :",match.match," Round :",match.round," P1 [",match.player1.id,"] (",match.player1.win,") VS P2 [",match.player2.id,"] (",match.player2.win,")"))

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

