import { useEffect } from "react";
import { useGameContext } from "./useGameContext";
import { useTournamentContext } from "./useTournamentContext";
import { useVenueContext } from "./useVenueContext";
import { useAuthContext } from "./useAuthContext";
import { useFileContext } from "./useFileContext";

export const useInitialFetch = () => {
  const { dispatch: dispatchTournament } = useTournamentContext();
  const { dispatch: dispatchGame } = useGameContext();
  const { dispatch: dispatchVenue } = useVenueContext();
  const { dispatch: dispatchFile } = useFileContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tournaments
        const tournamentsResponse = await fetch(
          "http://localhost:3002/api/tournaments",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const tournamentsData = await tournamentsResponse.json();
        dispatchTournament({
          type: "SET_TOURNAMENTS",
          payload: tournamentsData,
        });

        // Fetch games
        const gamesResponse = await fetch("http://localhost:3002/api/games", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const gamesData = await gamesResponse.json();
        dispatchGame({ type: "SET_GAMES", payload: gamesData });

        // Fetch venues
        const venuesResponse = await fetch("http://localhost:3002/api/venues", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const venuesData = await venuesResponse.json();
        dispatchVenue({ type: "SET_VENUES", payload: venuesData });

        // Fetch files
        const filesResponse = await fetch("http://localhost:3002/api/files", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const filesData = await filesResponse.json();
        dispatchFile({ type: "SET_FILES", payload: filesData });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user) {
      // Call the fetch data function when component mounts
      fetchData();
    }
  }, [dispatchTournament, dispatchGame, dispatchVenue, user]);
};
