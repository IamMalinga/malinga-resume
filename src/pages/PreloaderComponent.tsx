import React, { useEffect, useRef } from 'react';
import styles from '../styles/components/Preloader.module.css';
import { gsap } from 'gsap';

const PreloaderComponent: React.FC = () => {
  const preloaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure preloader is visible initially
    gsap.set(preloaderRef.current, { opacity: 1 });

    return () => {
      // Fade out on unmount
      gsap.to(preloaderRef.current, { opacity: 0, duration: 0.5 });
    };
  }, []);

  return (
    <div ref={preloaderRef} className={styles.preloader}>
      <div className={styles.preloaderContainer}>
        <svg
          className={styles.preloaderSvg}
          viewBox="0 0 50 50"
          width="50"
          height="50"
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            stroke="url(#gradient)"
            strokeWidth="5"
            fill="none"
            strokeDasharray="125.6"
            strokeDashoffset="0"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary-color)" />
              <stop offset="100%" stopColor="var(--gradient-end-color)" />
            </linearGradient>
          </defs>
        </svg>
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default PreloaderComponent;