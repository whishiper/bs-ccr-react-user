import React from 'react'
import styles from './index.less'

export default function Loading({ error,pastDelay }) {

  if (error) {
    return <div className={styles.main}>Error!</div>;
  }  else if (pastDelay) {
    return <div className={styles.main}>Loading...</div>;
  } else {
    return null;
  }
}