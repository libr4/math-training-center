import React, { useEffect, useState } from 'react'
import styles from './styles/MultiGameRoom.module.scss'
import test from '../test.svg'
import loader from '../loader.svg'
import secondPlayer from '../secondPlayer.svg'
import { useAppContext } from '../context/AppContext.js';
import { useSocketContext } from '../context/SocketContext.js';
import Loader from '../components/Loader.js'

export default function MultiGameRoom() {
  const socket = useSocketContext();

  const {roomName, playerName, 
        playerList, pushPlayerList,
        writeExpression} = useAppContext(); 

  const [players, setPlayers] = useState(playerList);
  const [expression, setExpression] = useState('');
  useEffect(() => {
    
    socket.on('players', (data) => {

      const otherPlayers = data.filter((player) => {
        return (player.playerName !== playerName);
      })
      setPlayers(otherPlayers);
    });

    socket.on('whoIsReady', (data) => {

      setPlayers(oldValue => {

        return oldValue.map((p) => {
          if (p.playerName === data.playerName) {
            p.isReady = data.isReady;
          }
          return p;
        })
      })
    });

    socket.on('setExpression', (expression) => {
      setExpression(expression);
    })

    return () => {
      socket.off('players');
    }
  }, [])
  const [ready, setReady] = useState(false);

  useEffect(()=> {
    if (ready && players[0]?.isReady) setTimeout(writeExpression, 5000);
  }, [ready, players[0]?.isReady])


  function toggleReady() {
    const isReady = !ready;
    const data = {playerName, isReady, roomName};
    socket.emit('ready', data);
    setReady(isReady);
  }

  return (
  <div className={styles['page']}>
    <div className={styles['ladoUm']}>
        <p>{players[0]?.playerName ?? "aguardando..."}</p>
        <img src={secondPlayer} alt='second player wheel'/>
        <p>SCORE: </p>
        <button>{players[0]?.isReady ? "Pronto!!" : "Aguardando..."}</button>
    </div>

    <div className={styles['ladoDois']}>
        
        <p>Sala <br></br><span></span>{roomName}</p>
        <p>{expression ? expression : ready && players[0]?.isReady ? `Gerando expressão` : "> Expressão aqui <"}</p>
        {(ready && players[0]?.isReady) && !(expression) && <Loader />}
      <div>
        <input type='text' placeholder='Resposta aqui'></input>
      </div>
    </div>
    <div className={styles['ladoTres']}>
      <p>{playerName ?? 0}</p>
      <img src={test} alt='your wheel'/>
      <p>SCORE:</p>
      <button onClick={toggleReady}>{ready ? "Pronto!!" : "Pronto??"}</button>
    </div>
  </div>
  )
}
