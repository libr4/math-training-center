import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AppProvider } from './context/AppContext';
import { SocketProvider } from './context/SocketContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import CreateRoom from './components/CreateRoom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/homepage' element={<Homepage />} />
            <Route path='/multiplayer' element={<CreateRoom />} />
            <Route path = '/' element={<App />}/>
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AppProvider>
  </React.StrictMode>
);
