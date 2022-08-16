import React, {useRef} from 'react'
import { useAppContext } from '../context/AppContext.js';
import styles from './styles/Sidebar.module.scss';
import { reduceDouble } from './utilities.js';


export default function Sidebar({children}) {
  const {points, answerTime, velocity} = useAppContext();  
  return (
    <div className={styles['sidebar']}>
        {children}
        <ul>
          <li>SCORE: {reduceDouble(points, 2) || 0}</li>
            <li>LAST ANSwer timE: {answerTime}</li>
            <li>VELOCITY: {reduceDouble(velocity, 2)}ms/question</li> {/** gotta handle velocity = 0 */}
        </ul>
    </div>
  );
}
