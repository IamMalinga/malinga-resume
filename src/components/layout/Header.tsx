import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/components/Header.module.css';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    console.log('Toggling theme from', theme);
    toggleTheme();
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCloseMenu = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <header ref={headerRef} className={styles.header}>
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
        <button
          className={styles.closeButton}
          onClick={handleCloseMenu}
          aria-label="Close mobile menu"
        >
          <X size={24} />
        </button>
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