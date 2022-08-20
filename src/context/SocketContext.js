import React from 'react'
import { useContext } from 'react'
import io from "socket.io-client";

export const SocketContext = React.createContext();
export function SocketProvider({children}) {
    const socket = io.connect('http://localhost:4000/');
    return (
        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
     )
}

export function useSocketContext() {
    return useContext(SocketContext);
}
