import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
import { TournamentContextProvider } from './context/TournamentContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <TournamentContextProvider>
        <App /> {/* So this App will become childer parameter for TournamentContextProvider */}
      </TournamentContextProvider>
  </React.StrictMode>
);

