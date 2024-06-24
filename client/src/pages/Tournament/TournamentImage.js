import React from "react";
import UploadImage from "../../components/UploadImage";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "src/components/ui/button";

function TournamentImage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleNavigateAndRefresh = () => {
    window.location.reload(); // Force page reload
    navigate("/tournaments/monitor" ,{ replace: true });
  };

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
      
      {/* Button to navigate to "/" and refresh the page */}
      <Button onClick={handleNavigateAndRefresh}>Proceed</Button>
    </div>
  );
}

export default TournamentImage;
