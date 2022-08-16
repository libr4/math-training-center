import React, { useEffect, useState } from 'react'
import styles from './styles/CreateRoom.module.scss';
import { useSocketContext } from '../context/SocketContext.js';
import {useNavigate} from 'react-router-dom';
import { useAppContext } from '../context/AppContext.js';
import RoomsList from './RoomsList.js';

export default function CreateRoom() {
  
  // const [room, setRoomName] = useState('');
  const [roomsTest, setRoomList] = useState([]);
  let navigate = useNavigate();
  
  const socket = useSocketContext();

  const {setPlayerName, playerName, setRoomName, roomName} = useAppContext();

  function createRoom() {
    let roomName = prompt("Room name:");
    const data = {roomName, playerName};
    socket.emit('roomCreated', data);
    return roomName;
  }

    useEffect(() => {

      if (!playerName) {
        let pName = prompt("Insira um nome ou apelido");
        setPlayerName(pName);
      }
      socket.on('newRoom', (roomName) => {
        setRoomList(oldState => [...oldState, roomName]);
      });
      
      socket.on('redirectToRoom', (roomName) => {
        if (roomName) setRoomName(roomName);
    });

    return () => {
      socket.off('newRoom');
      // socket.off('roomCreated');
    }
   }, [])

   useEffect(()=> {
    if (roomName) navigate(`/room/${roomName}`);
   },[roomName]);

  return (
    <div className={styles['createRoomContainer']}>
        <div className={styles['rooms']}>ROOMS:
            <RoomsList roomsList={roomsTest} />
        </div>
          <div>
            <button onClick={createRoom}>CREATE</button>
            <button>JOIN</button>
          </div>  
    </div>
  )
}
