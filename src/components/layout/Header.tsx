import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/Header.module.css';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon, Menu } from 'lucide-react';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleToggle = () => {
    console.log('Toggling theme from', theme);
    toggleTheme();
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPosition = window.scrollY;
      const progress = (scrollPosition / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        Samarakoon M.
      </Link>
      <button
        className={styles.mobileMenuToggle}
        onClick={handleMobileMenuToggle}
        aria-label="Toggle mobile menu"
        aria-expanded={isMobileMenuOpen}
      >
        <Menu size={24} />
      </button>
      <nav className={`${styles.navbar} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
        <Navbar />
      </nav>
      <button
        onClick={handleToggle}
        className={styles.themeToggle}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
      </button>
      <div className={styles.scrollBar} style={{ width: `${scrollProgress}%` }} />
    </header>
  );
};

export default Header;