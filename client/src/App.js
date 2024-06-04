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

function App() {
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
      <Route path="*" element={<NotFound />}/>
    </Routes>
    </>
  );
}

export default App;
