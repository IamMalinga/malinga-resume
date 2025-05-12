import { useState, useEffect } from 'react';
import { type Project } from '../types/project';

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Project One',
    description: 'A modern web app built with React.',
    image: '/images/project1.jpg',
    link: 'https://example.com',
    category: 'web',
  },
  {
    id: '2',
    title: 'Project Two',
    description: 'A branding project for a startup.',
    image: '/images/project2.jpg',
    link: 'https://example.com',
    category: 'design',
  },
];

export const useFetchProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  return { projects, loading };
};