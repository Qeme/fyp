import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useTournamentContext } from "../../hooks/useTournamentContext";

function TournamentType() {
  const navigate = useNavigate();
  const { dispatch } = useTournamentContext();
  const { user } = useAuthContext();

  /* 
    useEffect hook where it uses () => {} because we just want to call it once, not infinitly
    it has [] to be passed, so if [dispatch] changed, means it will rerun the useEffect hook
  */
  useEffect(() => {
    // create a function to fetch ALL the tournaments
    const fetchTournament = async () => {
      try {
        // create a variable to fetch
        const response = await fetch("http://localhost:3002/api/tournaments", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        // take the user input and pass it as json
        const json = await response.json();

        // check if response is ok or not
        if (response.ok) {
          // as we grab all the json tournaments data, we now SET the TOURNAMENTS by using the dispatch (from null to tournaments: tournaments)
          dispatch({ type: "SET_TOURNAMENTS", payload: json });
        } else {
          // if no response, send error to console
          console.error("Error fetching tournaments:", response.statusText);
        }
      } catch (error) {
        // this error indicates the fetching process not working at all, has backend problem
        console.error("Error fetching tournaments:", error);
      }
    };

    // if user is there, call the function
    if (user) {
      fetchTournament();
    }
  }, [dispatch, user]);

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
