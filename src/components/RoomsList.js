import React from 'react'
import { useSocketContext } from '../context/SocketContext.js';
import styles from './styles/RoomsList.module.scss'
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.js';

export default function RoomsList(props) {
    const socket = useSocketContext();
    const {setRoomName, playerName} = useAppContext();
    
    function joinRoom(roomName) {
        const data = {roomName, playerName};
        setRoomName(roomName);
        socket.emit('roomJoined', data);
      }
    return (
      props.roomsList.map((room, i)=> {
        return (<Link to={`/room/${room}`} key={i} onClick={() => joinRoom(room)} className={styles['roomsList']}>{room}</Link>);
      })
      )
}
