import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { AspectRatio } from "./ui/aspect-ratio";
import { useInitialFiles } from "src/hooks/useInitialFiles";
import { useInitialTournament } from "src/hooks/useInitialTournament";

function PreviewImage({ topic, tournamentid }) {
  const [imageUrl, setImageUrl] = useState("");
  const { tournaments } = useInitialTournament();
  const { user } = useAuthContext();
  const { files } = useInitialFiles();

  const tournament = tournaments.find(
    (tournament) => tournament?._id === tournamentid
  );

  useEffect(() => {
    const foundFile = files.find(
      (file) =>
        file.metadata.tournamentid === tournament?._id &&
        file.metadata.topic === topic
    );

    // console.log(foundFile)

    if (foundFile) {
      const preview = async () => {
        try {
          const response = await fetch(
            `http://localhost:3002/api/files/image/${foundFile.filename}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setImageUrl(imageUrl);
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      };

      if (user) {
        preview();
      }
    } else {
      setImageUrl(
        "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
      ); // Reset imageUrl and file when no file is found
    }
  }, [files, topic, tournament._id, user]);

  return (
    <AspectRatio ratio={16 / 9} className="bg-muted">
      <img
        src={imageUrl}
        alt={`Preview of ${topic}`}
        className="w-full h-full object-cover"
      />
    </AspectRatio>
  );

  // return (
  //   <div>
  //     {imageUrl ? (
  //       <img src={imageUrl} alt="Preview" />
  //     ) : (
  //       <p>No image available</p>
  //     )}
  //   </div>
  // );
}

export default PreviewImage;
