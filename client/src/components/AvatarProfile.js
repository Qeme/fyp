import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useFileContext } from "src/hooks/useFileContext";
import { useAuthContext } from "src/hooks/useAuthContext";

function AvatarProfile({ participant }) {
  const [imageUrl, setImageUrl] = useState("");
  const { user } = useAuthContext();
  const { files } = useFileContext();

  useEffect(() => {
    const foundFile = files.find(
      (file) =>
        file.metadata.topic === "profile" &&
        (file.metadata.uploader.$oid || file.metadata.uploader) ===
          participant._id
    );

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
      setImageUrl(""); // Reset imageUrl and file when no file is found
    }
  }, [files, user, participant]);

  return (
    <Avatar>
      <AvatarImage src={imageUrl} alt="user profile" />
      <AvatarFallback className="bg-orange-600">
        <span className="text-white">{participant?.name.slice(0, 2).toUpperCase()}</span>
      </AvatarFallback>
    </Avatar>
  );
}

export default AvatarProfile;
