import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { GameContextProvider } from "./context/GameContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GameContextProvider>
        <App />
      </GameContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
