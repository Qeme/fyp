import React from "react";
import UploadImage from "../../components/UploadImage";
import { useParams } from "react-router-dom";

function TournamentImage() {
  const { id } = useParams();
  return (
    <div>
      <div>
        <h3>Background Image: </h3>
        <UploadImage tournamentid={id} topic={'tour_bg'}/>
      </div>
      <div>
        <h3>Banner Image: </h3>
        <UploadImage tournamentid={id} topic={'tour_banner'}/>
      </div>
      <div>
        <h3>QR Online Banking: </h3>
        <UploadImage tournamentid={id} topic={'tour_qr'}/>
      </div>
    </div>
  );
}

export default TournamentImage;
