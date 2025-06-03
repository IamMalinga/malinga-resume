import React, { useEffect, useRef } from 'react';
import styles from '../../styles/components/Footer.module.css';
import { gsap } from 'gsap';

const Footer: React.FC = () => {
  const socialsRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // GSAP animation for social links and copyright
    gsap.fromTo(
      [socialsRef.current?.children, copyrightRef.current],
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
      }
    );

    // Hover animation for social icons
    const links = socialsRef.current?.querySelectorAll('a');
    links?.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, {
          scale: 1.2,
          rotate: 5,
          color: 'var(--secondary-color)',
          duration: 0.3,
          ease: 'power2.out',
        });
      });
      link.addEventListener('mouseleave', () => {
        gsap.to(link, {
          scale: 1,
          rotate: 0,
          color: 'var(--primary-color)',
          duration: 0.3,
          ease: 'power2.out',
        });
      });
    });

    return () => {
      gsap.killTweensOf([socialsRef.current?.children, copyrightRef.current]);
      links?.forEach((link) => {
        link.removeEventListener('mouseenter', () => {});
        link.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  // Static last updated timestamp (replace with your actual deployment date)
  const lastUpdated = new Date('2025-06-03T13:43:00+05:30'); // Placeholder: June 3, 2025, 1:43 PM IST
  const formattedDateTime = `${lastUpdated.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  })} on ${lastUpdated.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}`;

  return (
    <footer className={styles.footer}>
      <div ref={socialsRef} className={styles.socials}>
        <a href="https://linkedin.com/in/malinga-samarakoon-b8333527b/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <i className="fab fa-linkedin"></i>
        </a>
        <a href="https://github.com/IamMalinga" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <i className="fab fa-github"></i>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <i className="fab fa-instagram"></i>
        </a>
      </div>
      <p ref={copyrightRef} className={styles.copyright}>
        © {new Date().getFullYear()} Malinga Samarakoon. All rights reserved. | Last updated: {formattedDateTime}
      </p>
    </footer>
  );
};

export default Footer;