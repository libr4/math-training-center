import React, {useRef} from 'react'
import { useAppContext } from '../context/AppContext.js';
import styles from './styles/Sidebar.module.scss';
import { reduceDouble } from './utilities.js';


export default function Sidebar(props) {
  const {points, answerTime, velocity} = useAppContext();  
  const nameRef = useRef()

  return (
    <div className={styles['sidebar']}>
        <input type="text" ref={nameRef} id='name' placeholder='insira seu nome'></input>
        <input type='button' onClick={() => props.getPlayerName(nameRef)} id='send-name' value='send'></input>
        <ul>
          <li>SCORE: {reduceDouble(points, 2) || 0}</li>
            <li>LAST ANSwer timE: {answerTime}</li>
            <li>VELOCITY: {reduceDouble(velocity, 2)}ms/question</li> {/** gotta handle velocity = 0 */}
        </ul>
    </div>
  );
}
