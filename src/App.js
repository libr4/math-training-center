import logo from './test.svg';
import {re5, la5, mi5, la4, re6} from './notes/index.js'
import './App.css';
import {evaluate} from 'mathjs';
import { useEffect, useRef, useState } from 'react';
import Sidebar from './components/Sidebar.js';
import { useAppContext } from './context/AppContext.js';
import PlayerTwo from './components/PlayerTwo.js';
import { useSocketContext } from './context/SocketContext.js';
import { Outlet } from 'react-router-dom';
import { useParams } from 'react-router-dom'


// const socket = io.connect('http://localhost:5000/');

function playAudio(path) {
  const sound = new Audio(path);
  sound.play();
}

function App() {
  const socket = useSocketContext();

  const {expression, question, points,
        level, answerTime, questionTime,
        writeExpression, answerTimeCalc, 
        callNextQuestion, setDifficulty, 
        velocityCalc, updatePoints} = useAppContext();

  const [isConnected, setIsConnected] = useState(socket.connected);
  // const [lastPong, setLastPong] = useState(null);
  const nameRef = useRef();
  
  function getName() {
    socket.emit('name', nameRef.current.value);
  }

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    // socket.on('disconnect', () => {
    //   setIsConnected(false);
    // });

    socket.on('congrats', (ansTime) => {
      if (ansTime) updatePoints(points, ansTime) //this if statement prevents division by zero
    });

    socket.on('a', msg => {console.log(msg)});

    socket.on("startGame", (data) => console.log(data));

    return () => {
      socket.off('connect');
      socket.off('a')
      socket.off('congrats');
    };

  }, []);

  const sendPing = () => {

    socket.emit('join');
  
  }

  function setClass(...classes) {
    return classes.join(' ');
  }

  useEffect(()=>writeExpression(), []); //generates first expression on website;

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
      if (question % 6 == 0) playAudio(re5);
      else if (question % 6 == 1) playAudio(la5);
      else if (question % 6 == 2) playAudio(re6);
      else if (question % 6 == 3) playAudio(la4);
      else if (question % 6 == 4) playAudio(mi5);
      else if (question % 6 == 5) playAudio(la5);
      answerTimeCalc(); //also calculates totalTime
      
      console.log(answerTime)
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
  return (
    <div className="App">
      <header>
        <PlayerTwo></PlayerTwo>

      </header>
      <Outlet />
      {roomName
      }
      <div className="main">
      <header className="App-header">
        <img src={logo} className={"App-logo " + (spinLogo ? setClass("girar") : '')} alt="logo" />
      </header>
          <p>{expression}?</p>
        <input type="text" placeholder="insiraaa" onChange={getAnswer}></input>
      </div>
          <Sidebar algo='shabl'>
              <input type="text" ref={nameRef} id='name' placeholder='insira seu nome'></input>
              <input type='button' onClick={getName} id='send-name' value='send'></input>
          </Sidebar>
          <button type='button' onClick={sendPing}>shablau</button>
    </div>
  );
}

export default App;
