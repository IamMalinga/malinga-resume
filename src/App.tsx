import React, { useEffect, useState } from 'react';
import { BrowserRouter, BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ProjectProvider } from './context/ProjectContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AppRoutes from './routes';
import './styles/global.css';
import { initGA, logPageView } from './utils/analytics';
import supabase from './utils/supabase'; // Import Supabase client


// Component to handle dynamic title
const TitleUpdater: React.FC = () => {
  const location = useLocation();
  const baseTitle = 'Malinga Samarakoon';
  const [postTitle, setPostTitle] = useState<string | null>(null);

  useEffect(() => {
    initGA(); // Initialize Google Analytics once on mount
  }, []);

  useEffect(() => {
    logPageView(location.pathname + location.search);
  }, [location]);

  useEffect(() => {
    let pageTitle = baseTitle;

    // Handle blog post pages
    const blogPostIdMatch = location.pathname.match(/^\/blog\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);
    if (blogPostIdMatch) {
      const postId = blogPostIdMatch[1];
      // Fetch post title from Supabase
      const fetchPostTitle = async () => {
        try {
          const { data, error } = await supabase
            .from('posts')
            .select('title')
            .eq('id', postId)
            .single();

          if (error) {
            throw new Error(`Failed to fetch post title: ${error.message}`);
          }
          if (data?.title) {
            setPostTitle(data.title);
            pageTitle = `${data.title} | ${baseTitle}`;
          } else {
            setPostTitle(null);
            pageTitle = `Blog | ${baseTitle}`; // Fallback if no post found
          }
        } catch (err) {
          console.error(err);
          setPostTitle(null);
          pageTitle = `Blog | ${baseTitle}`; // Fallback on error
        }
        // Update document title
        document.title = pageTitle;
      };

      fetchPostTitle();
      return; // Exit early to avoid setting other titles
    }

    // Reset post title for non-blog routes
    setPostTitle(null);

    // Map other routes to page titles
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
        // Handle dynamic routes or 404
        if (location.pathname.startsWith('/portfolio/')) {
          pageTitle = `Project | ${baseTitle}`;
        } else {
          pageTitle = `Page Not Found | ${baseTitle}`;
        }
    }

    // Update document title for non-blog routes
    document.title = pageTitle;
  }, [location, baseTitle]);

  return null; // This component doesn't render anything
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <BrowserRouter>
          <TitleUpdater />
          <Header />
          <AppRoutes />
          <Footer />
        </BrowserRouter>
      </ProjectProvider>
    </ThemeProvider>
  );
};

export default App;