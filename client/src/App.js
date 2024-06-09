import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import TournamentRoutes from "./routes/TournamentRoutes";
import UserRoutes from "./routes/UserRoutes";
import TeamRoutes from "./routes/TeamRoutes";
import GameRoutes from "./routes/GameRoutes";
import VenueRoutes from "./routes/VenueRoutes";
import PaymentRoutes from "./routes/PaymentRoutes";
import Signup from "./pages/User/Signup";
import Login from "./pages/User/Login";
import { useTournamentContext } from "./hooks/useTournamentContext";
import { useGameContext } from "./hooks/useGameContext";
import { useVenueContext } from "./hooks/useVenueContext";
import { useEffect } from "react";

function App() {
  const { dispatch: dispatchTournament } = useTournamentContext();
  const { dispatch: dispatchGame } = useGameContext();
  const { dispatch: dispatchVenue } = useVenueContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tournaments
        const tournamentsResponse = await fetch("http://localhost:3002/api/tournaments");
        const tournamentsData = await tournamentsResponse.json();
        dispatchTournament({ type: "SET_TOURNAMENTS", payload: tournamentsData });

        // Fetch games
        const gamesResponse = await fetch("http://localhost:3002/api/games");
        const gamesData = await gamesResponse.json();
        dispatchGame({ type: "SET_GAMES", payload: gamesData });

        // Fetch venues
        const venuesResponse = await fetch("http://localhost:3002/api/venues");
        const venuesData = await venuesResponse.json();
        dispatchVenue({ type: "SET_VENUES", payload: venuesData });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the fetch data function when component mounts
    fetchData();
  }, [dispatchTournament, dispatchGame, dispatchVenue]);

  return (
    <>
    {/* this nav have links to navigate through pages easily */}
    <Navbar />

    {/* this routes only be used for the URL...however we need Link to navigate through pages */}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tournaments/*" element={<TournamentRoutes />}/>
      <Route path="/users/*" element={<UserRoutes />}/>
      <Route path="/teams/*" element={<TeamRoutes />}/>
      <Route path="/games/*" element={<GameRoutes />}/>
      <Route path="/venues/*" element={<VenueRoutes />}/>
      <Route path="/payments/*" element={<PaymentRoutes />}/>
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />}/>
    </Routes>
    </>
  );
}

export default App;
