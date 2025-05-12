import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/components/NotFound.module.css';

const NotFound: React.FC = () => {
  return (
    <main className={styles.notFound}>
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-lg mt-4">
        Sorry, the page you're looking for doesn't exist.
      </p>
      <Link to="/" className={styles.link}>
        Back to Home
      </Link>
    </main>
  );
};

export default NotFound;