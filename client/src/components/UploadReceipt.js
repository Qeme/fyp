import React, { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { useFileContext } from "../hooks/useFileContext";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import CancelButton from "./CancelButton";
import { useNavigate } from "react-router-dom";
import { usePaymentContext } from "../hooks/usePaymentContext";

function UploadReceipt({ tournamentid, payertype, teamid }) {
  const { dispatch } = useFileContext();
  const { dispatch: dispatchPayment } = usePaymentContext();
  const [file, setFile] = useState(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();

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
    fd.append("topic", "receipt");
    fd.append("payertype", payertype);
    fd.append("teamid", teamid);

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
        const { file, payment } = res.data;
        if (file) {
          dispatch({ type: "UPLOAD_FILE", payload: file });
        }
        if (payment) {
          dispatchPayment({ type: "CREATE_PAYMENT", payload: payment });
        }
        setFile(null);
        navigate("/payments/history");
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  return (
    <div>
      <div>
        <Input
          id="picture"
          type="file"
          onChange={fileSelectedHandler}
          className="flex-1"
        />

        <Button onClick={fileUploadHandler} className="w-full my-2">
          Submit
        </Button>
        <CancelButton />
      </div>
    </div>
  );
}

export default UploadReceipt;
