import React, { createContext, useContext, useState, useEffect } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tech: string[];
  duration: string;
}

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching projects (replace with actual API call if needed)
    const fetchedProjects: Project[] = [
      {
        id: '1',
        title: 'Data Quest',
        description: 'Built a system for 200 users at the Faculty of Management using React.js and Firebase. Streamlined data collection with secure authentication and efficient database management.',
        category: 'web',
        tech: ['React.js', 'Firebase'],
        duration: 'Aug 2024 - Oct 2024',
      },
      {
        id: '2',
        title: 'Gym Management System',
        description: 'Developed a web-based system using PHP, MySQL, HTML, Bootstrap, and JavaScript for gym operations. Features include member registration, progress tracking, and admin dashboards.',
        category: 'web',
        tech: ['PHP', 'MySQL', 'HTML', 'Bootstrap', 'JavaScript'],
        duration: 'Mar 2024 - Jun 2024',
      },
      {
        id: '3',
        title: 'Tutor’s MERN Exam Records Portal',
        description: 'Created a MERN-based portal with role-based authentication, OTP verification, and automated Z-score calculation. Included PDF result generation, blog platform, and video class system with payment integration.',
        category: 'web',
        tech: ['MERN', 'Node.js', 'Express.js', 'MongoDB'],
        duration: 'Mar 2024 - Jun 2024',
      },
      {
        id: '4',
        title: 'Malicious File Blocker',
        description: 'Designed a Chrome extension to scan and block malicious file downloads in real-time. Integrated with a backend service to enhance user security.',
        category: 'extension',
        tech: ['JavaScript', 'Chrome API'],
        duration: 'Apr 2024 - May 2024',
      },
      {
        id: '5',
        title: 'Todo Master',
        description: 'Developed an Android app using Java and Firebase with task creation, reminders, user authentication, data persistence, and dark mode support.',
        category: 'mobile',
        tech: ['Java', 'Firebase', 'Android'],
        duration: 'Apr 2024 - May 2024',
      },
      {
        id: '6',
        title: 'Real-Time Weather App',
        description: 'Built a weather app using Angular, integrating the OpenWeather API for real-time temperature, conditions, and forecasts with a seamless user experience.',
        category: 'web',
        tech: ['Angular', 'OpenWeather API'],
        duration: 'Jan 2024 - Feb 2024',
      },
      {
        id: '7',
        title: 'Event Registration System',
        description: 'Developed a web app using the MERN stack with JWT authentication for Sinhala and Tamil New Year Games event registration. Managed the project independently.',
        category: 'web',
        tech: ['MERN', 'JWT'],
        duration: 'Jan 2023 - Mar 2023',
      },
      {
        id: '8',
        title: 'DevOps Capstone Project',
        description: 'Designed and deployed a full-stack website to the cloud using Docker, Kubernetes, and Openshift. Focused on DevOps, Agile methodologies, and application security.',
        category: 'devops',
        tech: ['Docker', 'Kubernetes', 'Openshift'],
        duration: '2023 - 2024',
      },
    ];

    setProjects(fetchedProjects);
    setLoading(false);
  }, []);

  return (
    <ProjectContext.Provider value={{ projects, loading }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};