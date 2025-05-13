import React from 'react';
import Hero from '../components/sections/Hero';
import styles from '../styles/components/Home.module.css';

const Home: React.FC = () => {

  return (
    <main className={styles.homeContainer}>
      <Hero />
    </main>
  );
};

export default Home;