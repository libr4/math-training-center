import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import { AppProvider } from './context/AppContext.js';
import { SocketProvider } from './context/SocketContext.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage.js';
import CreateRoom from './components/CreateRoom.js';
import MultiGameRoom from './views/MultiGameRoom.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <SocketProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/homepage' element={<Homepage />} />
            <Route path='/multiplayer' element={<CreateRoom />} />
            <Route path = '/room/:roomName' element={<MultiGameRoom />} />
            <Route path = '/s' element={<App />} />
               {/* <>
               <MathGen></MathGen>
               </>  */}
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </SocketProvider>
  //{/* </React.StrictMode> */}
);
