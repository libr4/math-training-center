// import logo from './logo.svg';
// import logo from './math.png';
import logo from './test.svg';
import {re5, la5, mi5, la4, re6} from './notes/'
import './App.css';
import {evaluate} from 'mathjs';
import { useEffect, useReducer, useState } from 'react';
import reducer from './components/reducer';
import * as utilities from './components/utilities.js'

function App() {

  let initialState = {
    numberOfOperations: 1,
    expression:'',
    operation:'+',
    level:0,
    question:0,
    answer:'',
    points:0,
    answerTime:0, questionTime:0, velocity:0, totalTime:0,
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const [rightAnswer, setRight] = useState(false);

  useEffect(()=>writeExpression(), [])

  function playAudio(path) {
    const sound = new Audio(path);
    sound.play();
  }

  function setClass(str) {
    return str;
  }

  function setQuestionTime() {
    let questionTime = Date.now();
    dispatch({type:"QUESTION_TIME", payload:questionTime});
  }

  function answerTimeCalc() {
    let currentTime = Date.now();
    let answerTime = currentTime - state.questionTime;
    let totalTime = state.totalTime + answerTime;
    dispatch({type:"ANSWER_TIME", payload:{answerTime, totalTime}});
  }

  function writeExpression() {
    let expression = utilities.expressionGenerator(state.numberOfOperations, state.level);
    dispatch({type:"MAKE_EXPRESSION", payload:expression});
    setQuestionTime();
  }

  function callNextQuestion() {
    let question = state.question + 1;
    dispatch({type: "CALL_NEXT_QUESTION", payload: question});
    // console.log(state.question)
  }

  function updatePoints() {
    let points = state.points + 100000/state.answerTime;
    dispatch({type:"UPDATE_POINTS", payload:points});
  }

  function velocityCalc() {
    let velocity = (state.totalTime / state.question) || 0;
    dispatch({type:"VELOCITY_CALC", payload:velocity});
  }

  function setDifficulty(questions, currentLevel) {
    if (questions && questions % 5 == 0) {
      let level = currentLevel + 1;
      dispatch({type:"SET_DIFFICULTY", payload:level});
    }
  }

  function getAnswer(event) {
    
    if (event.target.value == evaluate(state.expression)) {
      setRight(true)
      setTimeout(() => setRight(false), 1000);
      if (state.question % 6 == 0) playAudio(re5);
      else if (state.question % 6 == 1) playAudio(la5);
      else if (state.question % 6 == 2) playAudio(re6);
      else if (state.question % 6 == 3) playAudio(la4);
      else if (state.question % 6 == 4) playAudio(mi5);
      else if (state.question % 6 == 5) playAudio(la5);
      answerTimeCalc(); //also calculates totalTime
      
    //  if (state.answerTime) updatePoints();
      callNextQuestion();
      event.target.value = '';
    }
  }

  useEffect(()=> {
    // setRight(false)
    setDifficulty(state.question, state.level);
    writeExpression();
    velocityCalc();
    if (state.answerTime) updatePoints() //this if statement prevents division by zero
    
  }, [state.question]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className={"App-logo " + (rightAnswer ? setClass("girar") : '')} alt="logo" />
        <p>POINTS: {utilities.reduceDouble(state.points) || 0}; TIME: {state.answerTime}ms; 
        TOTALTIME: {state.totalTime/1000}s; VELOCITY: {Math.round(state.velocity)}ms/question</p>
        <p>Quanto é {console.log(state.points)}</p>
          <p>{state.expression}?</p>
        <input type="text" placeholder="insiraaa" onChange={getAnswer}></input>
        {/* <p>{answer}</p> */}
      </header>
    </div>
  );
}

export default App;
