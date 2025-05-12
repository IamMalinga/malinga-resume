import React from 'react';
import styles from '../../styles/components/Loader.module.css';

const Loader: React.FC = () => {
  return <div className={styles.loader} aria-label="Loading"></div>;
};

export default Loader;