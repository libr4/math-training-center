import React, { useEffect, useState } from 'react'
import styles from './styles/CreateRoom.module.scss';
import { useSocketContext } from '../context/SocketContext.js';
import {Link, useNavigate} from 'react-router-dom';
import { useAppContext } from '../context/AppContext.js';



export default function CreateRoom() {
  
  // const [room, setRoomName] = useState('');
  const [roomsTest, setRoomTest] = useState([]);
  let navigate = useNavigate();
  
  const socket = useSocketContext();

  const { playerName } = useAppContext();

  function createRoom() {
    let roomName = prompt("Room name:");
    const data = {roomName, playerName};
    socket.emit('roomCreated', data);
    return roomName;
  }
  
  const {setPlayerName, setRoomName, roomName, pushPlayerList} = useAppContext();
  function joinRoom(roomName) {
    const data = {roomName, playerName};
    setRoomName(roomName);
    socket.emit('roomJoined', data);
  }

  function RoomsList(roomsList) {
    return (
      roomsList.map((room, i)=> {
        return (<Link to={`/room/${room}`} key={i} onClick={() => joinRoom(room)} className={styles['roomsList']}>{room}</Link>);
      })
      )
    }

    useEffect(()=>{

    let pName = prompt("Insira um nome ou apelido");
    setPlayerName(pName);
     
    socket.on('newRoom', (roomName) => {
        setRoomTest(oldState => [...oldState, roomName]);
    });

    socket.on('roomCreated', (roomName) => {
      if (roomName) setRoomName(roomName);
    });

    return () => {
      socket.off('shablau');
      socket.off('roomCreated');
    }
   }, [])

   useEffect(()=> {
    if (roomName) navigate(`/room/${roomName}`);
   },[roomName]);

  return (
    <div className={styles['createRoomContainer']}>
        <div className={styles['rooms']}>ROOMS:
            {RoomsList(roomsTest)}
        </div>
          <div>
            <button onClick={createRoom}>CREATE</button>
            <button>JOIN</button>
          </div>  
    </div>
  )
}
