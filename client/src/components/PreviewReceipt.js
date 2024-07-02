import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { AspectRatio } from "./ui/aspect-ratio";
import { useInitialFiles } from "src/hooks/useInitialFiles";

function PreviewReceipt({ receiptid }) {
  const [imageUrl, setImageUrl] = useState("");
  const { user } = useAuthContext();
  const { files } = useInitialFiles();

  useEffect(() => {
    const foundFile = files.find((file) => file.fileId === receiptid);

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
        ""
      ); // Reset imageUrl and file when no file is found
    }
  }, [files, receiptid, user]);

  return (
    <AspectRatio ratio={4 / 3} className="bg-muted">
      <img
        src={imageUrl}
        alt={`Preview of ${receiptid}`}
        className="w-full h-full object-cover"
      />
    </AspectRatio>
  );
}

export default PreviewReceipt;
