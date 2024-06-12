import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

function TournamentType() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleAllClick = () => {
    navigate("/tournaments");
  };

  const handleJoinClick = () => {
    navigate("/tournaments/type/join");
  };

  const handleMonitorClick = () => {
    navigate("/tournaments/type/monitor");
  };

  const handleCreateClick = () => {
    navigate("/tournaments/type/create");
  };

  return (
    <div className="tournament-type-container">
      {user && user.role === "admin" ? (
        <div className="tournament-type-box" onClick={handleAllClick}>
          <p>All Tournament</p>
        </div>
      ) : (
        ""
      )}
      <div className="tournament-type-box" onClick={handleJoinClick}>
        <p>Join Tournament</p>
      </div>
      <div className="tournament-type-box" onClick={handleMonitorClick}>
        <p>Monitor Tournament</p>
      </div>
      <div className="tournament-type-box" onClick={handleCreateClick}>
        <p>Create Tournament</p>
      </div>
    </div>
  );
}

export default TournamentType;
