import React, {useContext, useReducer} from 'react';
import reducer from './reducer.js';
import * as utilities from '../components/utilities.js';
import { useSocketContext } from './SocketContext.js';

let initialState = {
    numberOfOperations: 1,
    expression:'',
    operation:'+',
    level:0,
    question:0,
    answer:'',
    points:0,
    answerTime:0, questionTime:0, velocity:0, totalTime:0,
    roomName:'',
    playerList:[],
    playerName:''
}
export {initialState};

const AppContext = React.createContext();

export function AppProvider({children}) {
    
    const [state, dispatch] = useReducer(reducer, initialState);

    const socket = useSocketContext();

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
        let info = {numberOfOperations:state.numberOfOperations, question:state.question, roomName:state.roomName};
        socket.emit('expression', info);
        // dispatch({type:"MAKE_EXPRESSION", payload:expression});
        setQuestionTime();
      }
    
      function callNextQuestion() {
        dispatch({type: "CALL_NEXT_QUESTION"});
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

      function setRoomName(name) {
        dispatch({type:"CREATE_ROOM", payload:name});
      }

      function setPlayerName(name) {
        dispatch({type:"SET_NAME", payload:name});
      }
      function pushPlayerList(name) {
        dispatch({type:"PUSH_NAME", payload:name});
      }

      return <AppContext.Provider value={{...state, answerTimeCalc, writeExpression, callNextQuestion, 
                updatePoints, velocityCalc, setDifficulty, setRoomName, setPlayerName, pushPlayerList}}>{children}</AppContext.Provider>
}

function useAppContext() {
    return useContext(AppContext);
}

export {useAppContext};
