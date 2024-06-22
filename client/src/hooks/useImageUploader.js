import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "./useAuthContext";
import { useFileContext } from "./useFileContext";

const useImageUploader = () => {
  const [file, setFile] = useState(null);
  const { user } = useAuthContext();
  const { dispatch } = useFileContext();

  const onFileSelect = (e) => {
    e.preventDefault();
    
    setFile(e.target.files[0]);
  };

  const uploadFile = async (tournamentid, topic) => {
    console.log(file);  // Debug: Output the current file state
    
    if (!user) {
      console.error("Non Authorized User Detected");
      return;
    }

    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("tournamentid", tournamentid);
    formData.append("topic", topic);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${user.token}`,
      },
      onUploadProgress: (ProgressEvent) => {
        const progress = Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100);
        console.log("Uploading Progress: " + progress + "%");
      },
    };

    try {
      const response = await axios.post("http://localhost:3002/api/files", formData, config);
      dispatch({ type: "UPLOAD_FILE", payload: response.data });
      setFile(null);  // Clear the file after upload
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return { onFileSelect, uploadFile, file };
};

export default useImageUploader;
