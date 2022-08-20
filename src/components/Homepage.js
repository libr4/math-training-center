import React from 'react'
import styles from './styles/Homepage.module.scss'
import {Link} from 'react-router-dom'

export default function Homepage() {
  return (
  <>
  <div className={styles['buttonContainer']}>

      <Link to='/solo' className={styles['link']}>
        <button>SOLO</button>
      </Link>

      <Link to='/multiplayer' className={styles['link']}>
        <button>MULTIPLAYER</button>
      </Link>

      <Link to='/' className={styles['link']}>
        <button>Create an account</button>
      </Link>

      <Link to='/' className={styles['link']}>
        <button>LOGIN</button>
      </Link>
  </div>
  </>
  )
}
