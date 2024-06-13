import React from "react";
import { useNavigate } from "react-router-dom";

function JoinButton({ tournamentid }) {
  const navigate = useNavigate();
  const handleComp = () => {
    navigate(`/tournaments/join/${tournamentid}`);
  };
  return <button onClick={handleComp}>Join Tournament</button>;
}

export default JoinButton;
