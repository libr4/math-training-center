// import logo from './logo.svg';
// import logo from './math.png';
import logo from './test.svg';
import {re5, la5, mi5, la4, re6} from './notes/'
import './App.css';
import {evaluate} from 'mathjs';
import { useEffect, useReducer, useState } from 'react';
import Sidebar from './components/Sidebar';
import { useAppContext } from './context/AppContext';

function playAudio(path) {
  const sound = new Audio(path);
  sound.play();
}
function App() {
  const {expression, question, points, level, 
        velocity, totalTime, answerTime,
        writeExpression, answerTimeCalc, 
        callNextQuestion, setDifficulty, 
        velocityCalc, updatePoints} = useAppContext();


  function setClass(str) {
    return str;
  }

  useEffect(()=>writeExpression(), []);

  const [spinLogo, setSpin] = useState(false);

  function getAnswer(event) {
    
    if (event.target.value == evaluate(expression)) {
      setSpin(true)
      setTimeout(() => setSpin(false), 1000);
      if (question % 6 == 0) playAudio(re5);
      else if (question % 6 == 1) playAudio(la5);
      else if (question % 6 == 2) playAudio(re6);
      else if (question % 6 == 3) playAudio(la4);
      else if (question % 6 == 4) playAudio(mi5);
      else if (question % 6 == 5) playAudio(la5);
      answerTimeCalc(); //also calculates totalTime
      
    //  if (state.answerTime) updatePoints();
      callNextQuestion();
      event.target.value = '';
    }
  }

  useEffect(()=> {
    // setRight(false)
    setDifficulty(question, level);
    writeExpression();
    velocityCalc();
    if (answerTime) updatePoints() //this if statement prevents division by zero
    
  }, [question]);

  return (
    <div className="App">
      <div>
      <header className="App-header">
        <img src={logo} className={"App-logo " + (spinLogo ? setClass("girar") : '')} alt="logo" />
      </header>
          <p>{expression}?</p>
        <input type="text" placeholder="insiraaa" onChange={getAnswer}></input>
        </div>
          <Sidebar></Sidebar>
    </div>
  );
}

export default App;
