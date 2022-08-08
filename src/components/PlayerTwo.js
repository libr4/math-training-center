import React from 'react'
import secondPlayer from '../secondPlayer.svg';
import styles from './styles/PlayerTwo.module.css';

export default function () {
  return (
    <header className = {styles['headerP2']}>
        <img className={styles['secondPlayer']} src={secondPlayer} alt='wheel'></img>
    </header>
  )
}
