import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useFileContext } from "src/hooks/useFileContext";
import { useAuthContext } from "src/hooks/useAuthContext";

function AvatarProfile({ participant }) {
  const [imageUrl, setImageUrl] = useState("");
  const { user } = useAuthContext();
  const { files } = useFileContext();

  useEffect(() => {
    if (participant && participant._id) {
      const foundFile = files.find(
        (file) =>
          file &&
          file.metadata &&
          file.metadata.topic === "profile" &&
          (file.metadata.uploader?.$oid || file.metadata.uploader) ===
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

        preview();
      } else {
        setImageUrl(""); // Reset imageUrl and file when no file is found
      }
    }
  }, [files, user.token, participant]);

  return (
    <Avatar>
      <AvatarImage src={imageUrl} alt="user profile" className="object-cover" />
      <AvatarFallback className="bg-orange-600">
        <span className="text-white">
          {participant && participant.name
            ? participant.name.slice(0, 2).toUpperCase()
            : ""}
        </span>
      </AvatarFallback>
    </Avatar>
  );
}

export default AvatarProfile;
