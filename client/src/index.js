import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
import { WorkoutContextProvider } from './context/WorkoutContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WorkoutContextProvider>
      <App /> {/* So this App will become childer parameter for WorkoutContextProvider */}
    </WorkoutContextProvider>
  </React.StrictMode>
);

