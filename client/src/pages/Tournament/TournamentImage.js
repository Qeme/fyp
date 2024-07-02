import React from "react";
import UploadImage from "../../components/UploadImage";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";

function TournamentImage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reload the page first
    window.location.reload();

    // Then navigate to the desired destination
    navigate("/tournaments/monitor");
  };

  return (
    <main className="flex justify-center">
      <Card className="w-1/2 my-12">
        <CardHeader>
          <CardTitle><span className="font-bold text-3xl">Upload Images</span></CardTitle>
          <CardDescription>
            These include the background image of the tournament, a banner for
            advertising, and a QR code for ticket purchasing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4">
            <div>
              <h3>Background Image: </h3>
              <UploadImage tournamentid={id} topic={"tour_bg"} />
            </div>
            <div>
              <h3>Banner Image: </h3>
              <UploadImage tournamentid={id} topic={"tour_banner"} />
            </div>
            <div>
              <h3>QR Online Banking: </h3>
              <UploadImage tournamentid={id} topic={"tour_qr"} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-2 bg-orange-600 hover:bg-orange-500" onClick={handleSubmit}>Proceed</Button>
        </CardFooter>
      </Card>
    </main>
  );
}

export default TournamentImage;
