import React, {useContext, useReducer} from 'react';
import reducer from './reducer.js';
import * as utilities from '../components/utilities.js'

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
export {initialState};

const AppContext = React.createContext();

export function AppProvider({children}) {
    
    const [state, dispatch] = useReducer(reducer, initialState);

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
    
      function updatePoints(currentScore, ansTime) {
        // console.log("updt", points, ansTime)
        let points = 100000/ansTime;
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

      function setName() {

      }

      return <AppContext.Provider value={{...state, answerTimeCalc, writeExpression, callNextQuestion, 
                updatePoints, velocityCalc, setDifficulty}}>{children}</AppContext.Provider>
}

function useAppContext() {
    return useContext(AppContext);
}

export {useAppContext};
