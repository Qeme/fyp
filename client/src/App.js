import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import NavbarUser from "./components/NavbarUser";
import TournamentRoutes from "./routes/TournamentRoutes";
import UserRoutes from "./routes/UserRoutes";
import TeamRoutes from "./routes/TeamRoutes";
import GameRoutes from "./routes/GameRoutes";
import VenueRoutes from "./routes/VenueRoutes";
import PaymentRoutes from "./routes/PaymentRoutes";
import Signup from "./pages/User/Signup";
import Login from "./pages/User/Login";
import { useInitialFetch } from "./hooks/useInitialFetch";
import { useAuthContext } from "./hooks/useAuthContext";

function App() {
  // Call the custom hook to fetch initial data
  useInitialFetch();

  // extract user context
  const { user } = useAuthContext();

  return (
    <>
      {/* this nav have links to navigate through pages easily */}
      {user && user.role === "admin" ? <Navbar /> : <NavbarUser />}

      {/* this routes only be used for the URL...however we need Link to navigate through pages */}
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/tournaments/*" element={<TournamentRoutes />} />
        <Route path="/users/*" element={<UserRoutes />} />
        <Route path="/teams/*" element={<TeamRoutes />} />
        <Route path="/games/*" element={<GameRoutes />} />
        <Route path="/venues/*" element={user ? <VenueRoutes /> : <Navigate to="/login" />} />
        <Route path="/payments/*" element={<PaymentRoutes />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
