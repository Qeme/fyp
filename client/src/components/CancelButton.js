import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

function CancelButton() {
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate(-2);
  };
  return (
    <Button
      onClick={handleCancel}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
    >
      Cancel
    </Button>
  );
}

export default CancelButton;
