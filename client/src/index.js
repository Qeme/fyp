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
import { PaymentContextProvider } from "./context/PaymentContext";

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
                  <PaymentContextProvider>
                    <TournamentContextProvider>
                      <App />
                    </TournamentContextProvider>
                  </PaymentContextProvider>
                </FileContextProvider>
              </TeamContextProvider>
            </UserContextProvider>
          </VenueContextProvider>
        </GameContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
