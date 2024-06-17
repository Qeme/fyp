import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { GameContextProvider } from "./context/GameContext";
import { VenueContextProvider } from "./context/VenueContext";
import { TournamentContextProvider } from "./context/TournamentContext";
import { AuthContextProvider } from "./context/AuthContext";
import { FileContextProvider } from "./context/FileContext";
import { UserContextProvider } from "./context/UserContext";
import { TeamContextProvider } from "./context/TeamContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <GameContextProvider>
          <VenueContextProvider>
            <UserContextProvider>
              <TeamContextProvider>
                <FileContextProvider>
                  <TournamentContextProvider>
                    <App />
                  </TournamentContextProvider>
                </FileContextProvider>
              </TeamContextProvider>
            </UserContextProvider>
          </VenueContextProvider>
        </GameContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
