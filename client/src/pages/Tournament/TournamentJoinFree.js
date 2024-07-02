import { useAuthContext } from "src/hooks/useAuthContext";
import CancelButton from "src/components/CancelButton";
import { Button } from "src/components/ui/button";
import { useTournamentContext } from "src/hooks/useTournamentContext";
import { useNavigate } from "react-router-dom";

function TournamentJoinFree({ tournamentid, teamid, payertype }) {
  const { user } = useAuthContext();
  const { dispatch } = useTournamentContext();

  const navigate = useNavigate();

  const handleClick = async () => {

    if (!user) {
      return;
    }

    if (payertype === "competitor") {
      const response = await fetch(
        `http://localhost:3002/api/users/compete/${tournamentid}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: user._id, teamid: teamid }),
        }
      );

      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "UPDATE_TOURNAMENT", payload: json });
        navigate("/tournaments/join")
      }
    }
    else if(payertype === "viewer"){
      const response = await fetch(
        `http://localhost:3002/api/users/view/${tournamentid}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: user._id, teamid: teamid }),
        }
      );

      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "UPDATE_TOURNAMENT", payload: json });
        navigate("/tournaments/join")
      }
    }

    
  };

  return (
    <div className="w-full">
      <Button className="w-full my-2" onClick={handleClick}>
        Submit
      </Button>
      <CancelButton />
    </div>
  );
}

export default TournamentJoinFree;
