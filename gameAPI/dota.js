import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.API_KEY;
const STEAM_ID = process.env.STEAM_ID;
const GAME_ID = process.env.DOTA_ID;

async function getMatchHistory() {
    //getting the game API
    const url = `http://api.steampowered.com/IDOTA2Match_${GAME_ID}/GetMatchHistory/V001/?key=${API_KEY}&account_id=${STEAM_ID}`;

    //fetch the received data to the variable response
    const response = await fetch(url);
    const data = await response.json();
    console.log(data.result.matches)

    return data.result.matches;
}

async function displayMatchHistory() {
    const matches = await getMatchHistory();
    const matchHistoryElement = document.getElementById('matchHistory');
    
    matches.forEach(match => {
        const matchListItem = document.createElement('li');
        matchListItem.textContent = `Match ID: ${match.match_id}`;
        matchHistoryElement.appendChild(matchListItem);
    });
}




