import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ProjectProvider } from './context/ProjectContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AppRoutes from './routes';
import './styles/global.css';
import { initGA, logPageView } from './utils/analytics'; // Import GA functions

// Component to handle dynamic title
const TitleUpdater: React.FC = () => {
  const location = useLocation();
  const baseTitle = 'Malinga Samarakoon'; // Your default/base title

  useEffect(() => {
    initGA(); // Initialize once on mount
  }, []);

  useEffect(() => {
    logPageView(location.pathname + location.search);
  }, [location]);

  useEffect(() => {
    let pageTitle = baseTitle;

    // Map routes to page titles
    switch (location.pathname) {
      case '/':
        pageTitle = `Home | ${baseTitle}`;
        break;
      case '/about':
        pageTitle = `About | ${baseTitle}`;
        break;
      case '/portfolio':
        pageTitle = `Resume | ${baseTitle}`;
        break;
      case '/contact':
        pageTitle = `Contact | ${baseTitle}`;
        break;
      case '/blog':
        pageTitle = `Blog | ${baseTitle}`;
        break;
      default:
        // Handle dynamic routes or 404 (e.g., /portfolio/:id)
        if (location.pathname.startsWith('/portfolio/')) {
          pageTitle = `Project | ${baseTitle}`;
        } else {
          pageTitle = `Page Not Found | ${baseTitle}`;
        }
    }

    // Update the document title
    document.title = pageTitle;
  }, [location, baseTitle]);

  return null; // This component doesn't render anything
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <BrowserRouter>
          <TitleUpdater /> {/* Add the title updater component */}
          <Header />
          <AppRoutes />
          <Footer />
        </BrowserRouter>
      </ProjectProvider>
    </ThemeProvider>
  );
};

export default App;