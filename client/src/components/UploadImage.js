import React, { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { useFileContext } from "../hooks/useFileContext";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function UploadImage({ tournamentid, topic }) {
  const { dispatch } = useFileContext();
  const [file, setFile] = useState(null);
  const { user } = useAuthContext();

  const fileSelectedHandler = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
  };

  const fileUploadHandler = () => {
    if (!user) {
      console.log("Non Authorized User Detected");
      return;
    }

    if (!file) {
      console.log("No file selected");
      return;
    }

    const fd = new FormData();
    fd.append("file", file, file.name);
    fd.append("tournamentid", tournamentid);
    fd.append("topic", topic);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${user.token}`,
      },
      onUploadProgress: (ProgressEvent) => {
        console.log(
          "Uploading Progress: " +
            Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100) +
            "%"
        );
      },
    };

    axios
      .post("http://localhost:3002/api/files", fd, config)
      .then((res) => {
        console.log(res.data);
        const { file } = res.data;
        dispatch({ type: "UPLOAD_FILE", payload: file });
        setFile(null);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  return (
    <div className="grid w-full max-w-sm gap-1.5">
      <div className="flex items-center">
        <Input id="picture" type="file" onChange={fileSelectedHandler} className="flex-1 my-2" />
        <Button type="button" onClick={fileUploadHandler} className="ml-2">Upload</Button>
      </div>
    </div>
  );
}

export default UploadImage;
