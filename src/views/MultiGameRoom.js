import React, { useEffect, useState } from 'react'
import styles from './styles/MultiGameRoom.module.scss'
import test from '../test.svg'
import { evaluate } from 'mathjs'
import secondPlayer from '../secondPlayer.svg'
import { useAppContext } from '../context/AppContext.js';
import { useSocketContext } from '../context/SocketContext.js';
import Loader from '../components/Loader.js';
import { playAudio, playTrack, reduceDouble } from '../components/utilities.js'

export default function MultiGameRoom() {
  const socket = useSocketContext();

  const {roomName, playerName,
        playerList, pushPlayerList,
        writeExpression, questionTime} = useAppContext(); 

  const [players, setPlayers] = useState(playerList);
  const [expression, setExpression] = useState('');
  const [expressionData, setExpressionData] = useState({});
  const [question, setQuestion] = useState(0);
  const [points, setPoints] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [spin, setSpin] = useState(false);
  // const [questionTime, setQuestionTime] = useSTate(0);

  useEffect(() => {
    
    socket.on('players', (data) => {
      
      const otherPlayers = data.filter((player) => {
        return (player.playerName !== playerName);
      });

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
      });
    });

    socket.on('setExpression', (expression) => {
      setExpression(expression);

    })

    socket.on('updateInfo', (winnerInfo) => {
      if(winnerInfo.playerName === playerName) {
        setPoints(winnerInfo.points)
        setVelocity(winnerInfo.velocity)
        setSpin(true);
      }
      else {
        setPlayers(players => players.map((p) => {
          if (p.playerName === winnerInfo.playerName) {
            p.points = winnerInfo.points;
            p.velocity = winnerInfo.velocity;
            p.spin = true;
          }
          return p;
        }));
        setExpression('')
        setTimeout(() => {setPlayers(players => players.map(p => {
          p.spin = false;
          return p;
        }))}, 1000);
      }
      setQuestion((oldValue) => oldValue + 1);
    })

    return () => {
      socket.off('players');
    }
  }, []);

  const [ready, setReady] = useState(false);

  useEffect(()=> {
    if (ready && players[0]?.isReady) {
      let waitExpression = setTimeout(writeExpression, 5000);
      return () => {
        clearTimeout(waitExpression);
      }
    }  
  }, [ready, players[0]?.isReady, question])

  // useEffect(()=> {
  //   const waitExpression = setTimeout(() => {
  //     console.log('question dependency')
  //     writeExpression();
  //   }, 5000);

  //   return () => {
  //     clearTimeout(waitExpression);
  //   }
  // }, [question]);


  function toggleReady() {
    const isReady = !ready;
    const data = {playerName, isReady, roomName};
    socket.emit('ready', data);
    setReady(isReady);
  }

  function timeOfAnswer() {
    let currentTime = Date.now();
    let answerT = currentTime - questionTime;
    return answerT;
  }

  function getAnswer(event) {
    
    if (event.target.value == evaluate(expression)) {
      setExpression('');
      const answerT = timeOfAnswer();
      const data = {playerName, roomName, answerT, question};
      socket.emit('right-answer', data);
      console.log('working so far...')
      setSpin(true);
      // setSpin(true)
      setTimeout(() => setSpin(false), 1000);
      // playTrack(question);
      // answerTimeCalc(); //also calculates totalTim
      
      // console.log(answerTime)
    //  if (state.answerTime) updatePoints();
      // callNextQuestion();
      event.target.value = '';
    }
  }

  return (
  <div className={styles['page']}>
    <div className={styles['ladoUm']}>
        <p>{players[0]?.playerName ?? "aguardando..."}</p>
        <img src={secondPlayer} alt='second player wheel' className={players[0]?.spin ? styles['girar'] : ''}/>
        <p>SCORE: {reduceDouble(players[0]?.points, 2) || 0}</p>
        <button>{players[0]?.isReady ? "Pronto!!" : "Aguardando..."}</button>
    </div>

    <div className={styles['ladoDois']}>
        
        <p>Sala <br></br><span></span>{roomName}</p>
        <div>{expression ? expression : ready && players[0]?.isReady ? <div>Espere a próxima expressão...<br /><Loader /></div> : "> Expressão aqui <"}</div>
        {/* {(ready && players[0]?.isReady) && !(expression) && <Loader />} */}
      <div>
        <input type='text' placeholder='Resposta aqui' onChange={getAnswer}></input>
      </div>
    </div>
    <div className={styles['ladoTres']}>
      <p>{playerName ?? 0}</p>
      <img src={test} alt='your wheel' className={spin ? styles['girar'] : ''}/>
      <p>SCORE: {reduceDouble(points, 2) || 0}</p>
      <button onClick={toggleReady}>{ready ? "Pronto!!" : "Pronto??"}</button>
    </div>
  </div>
  )
}
