import React from "react";
import { useNavigate } from "react-router-dom";

function CancelButton() {
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate('/tournaments/type');
  };
  return <button onClick={handleCancel}>Cancel</button>;
}

export default CancelButton;
