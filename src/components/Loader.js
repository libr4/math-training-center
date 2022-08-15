import React from 'react'
import styles from './styles/Loader.module.scss'
import loader from '../loader.svg'

export default function Loader() {
  return (
    <div><img src={loader} alt='loader' className={styles['loader']} ></img></div>
  )
}
