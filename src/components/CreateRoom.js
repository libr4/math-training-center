import React from 'react'
import styles from './styles/CreateRoom.module.scss';
export default function CreateRoom() {
  return (
    <div className={styles['createRoomContainer']}>
        <div className={styles['rooms']}>ROOMS:</div>
          <div>
            <button>CREATE</button>
            <button>JOIN</button>
          </div>  
    </div>
  )
}
