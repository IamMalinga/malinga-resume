import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../styles/components/Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.nav}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? styles.activeLink : styles.link
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) =>
          isActive ? styles.activeLink : styles.link
        }
      >
        About
      </NavLink>
      <NavLink
        to="/portfolio"
        className={({ isActive }) =>
          isActive ? styles.activeLink : styles.link
        }
      >
        Resume
      </NavLink>
      <NavLink
        to="/contact"
        className={({ isActive }) =>
          isActive ? styles.activeLink : styles.link
        }
      >
        Contact
      </NavLink>
      <NavLink
        to="/blog"
        className={({ isActive }) =>
          isActive ? styles.activeLink : styles.link
        }
      >
        Blog
      </NavLink>
    </nav>
  );
};

export default Navbar;