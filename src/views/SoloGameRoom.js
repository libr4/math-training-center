import logo from '../test.svg';
import {evaluate} from 'mathjs';
import { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar.js';
import { useAppContext } from '../context/AppContext.js';
import PlayerTwo from '../components/PlayerTwo.js';
import { useSocketContext } from '../context/SocketContext.js';
import { useParams } from 'react-router-dom'
import { playTrack } from '../components/utilities.js';

export default function SoloGameRoom() {
  const socket = useSocketContext();

  const {expression, question, points,
        level, answerTime, questionTime,
        writeExpression, answerTimeCalc, 
        callNextQuestion, setDifficulty, 
        velocityCalc, updatePoints} = useAppContext();
  
  function setClass(...classes) {
    return classes.join(' ');
  }

  function answerTim() {
    let currentTime = Date.now();
    let answerT = currentTime - questionTime;
    return answerT;
  }
  const [spinLogo, setSpin] = useState(false);

  function getAnswer(event) {
    
    if (event.target.value == evaluate(expression)) {
      const answerT = answerTim();
      socket.emit('right-answer', answerT);
      setSpin(true)
      setTimeout(() => setSpin(false), 1000);
      playTrack();
      answerTimeCalc(); //also calculates totalTime
      
    //  if (state.answerTime) updatePoints();
      callNextQuestion();
      event.target.value = '';
    }
  }

  useEffect(()=> {
    setDifficulty(question, level);
    writeExpression();
    velocityCalc();
    // if (answerTime) updatePoints() //this if statement prevents division by zero
    
  }, [question]);
  const {roomName} = useParams();
  const [playerName, setPlayerName] = useState("");

  const getPlayerName = (ref) => {
    const pName = ref.current.value;
    setPlayerName(pName);
  }

  return (
    <div className="App">
      {roomName}
      <div className="main">
      <header className="App-header">
        <img src={logo} className={"App-logo " + (spinLogo ? setClass("girar") : '')} alt="logo" />
      </header>
          <p>{expression}?</p>
        <input type="text" placeholder="insiraaa" onChange={getAnswer}></input>
      </div>
          {playerName || "name"}
          <Sidebar getPlayerName={getPlayerName}>
          </Sidebar>
    </div>
  );
}