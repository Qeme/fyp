import React, { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";

function UploadImage({ tournamentid , topic }) {

  // have a state to handle that particular file
  const [file, setFile] = useState(null);
  const { user } = useAuthContext();

  // console.log to see the details of the uploaded image
  // only choose the first file, if the user puts too many files
  const fileSelectedHandler = (e) => {
    e.preventDefault();
    // console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  };

  const fileUploadHandler = () => {
    // construct a formData which you need to pass it to axios, make sure the properties file is equal to backend file
    const fd = new FormData();
    fd.append("file", file, file.name);
    fd.append("tournamentid", tournamentid);
    fd.append("topic", topic);

    // Set up the headers
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

    // use Axios to handle that file upload
    // first argument is the URL API, pass the fd data, third argument would be the progress of uploading the file
    axios.post("http://localhost:3002/api/files", fd, config).then((res) => {
      console.log(res);
    });
  };

  return (
    <div>
      {/* input has:
            1. type of file, as we uploading file
            2. onChange means whenever the user change the file, we can see it (fileSelectedHandler)*/}
      <input type="file" onChange={fileSelectedHandler} />
      <button onClick={fileUploadHandler}>Upload</button>
    </div>
  );
}

export default UploadImage;
