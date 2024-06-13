import React from "react";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return <button onClick={handleBack}>Back</button>;
}

export default BackButton;
