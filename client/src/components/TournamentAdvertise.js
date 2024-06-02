// src/pages/TournamentAdvertise.js
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const TournamentAdvertise = ({tournament}) => {

  return (
    <div>
        <h1>Tournament Details:</h1>
      {tournament ? (
        <div>
          <h2>{tournament.name}</h2>
          <p><strong>Representative: </strong>{tournament.meta.representative.repType}</p>
          <p><strong>Stage One: </strong>{tournament.setting.stageOne.format}</p>
          <p><strong>Stage Two: </strong>{tournament.setting.stageTwo.format}</p>
          <p><strong>Best Of: </strong>{tournament.setting.scoring.bestOf}</p>
          <p>{formatDistanceToNow(new Date(tournament.createdAt), { addSuffix: true })}</p>
          {/* Add more detailed fields here */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TournamentAdvertise;
