import React from 'react'
import { useAppContext } from '../context/AppContext'
import { reduceDouble } from './utilities';

export default function Sidebar() {
  const {points, answerTime, velocity} = useAppContext();  
  return (
    <div>
        <ul>
            <li>SCORE: {reduceDouble(points, 2) || 0}</li>
            <li>LAST ANSWER TIME: {answerTime}</li>
            <li>VELOCITY: {reduceDouble(velocity, 1)}ms/question</li>
        </ul>
    </div>
  )
}
