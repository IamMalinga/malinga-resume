import { type Project } from '../types/project';

export const fetchProjects = async (): Promise<Project[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          title: 'Project One',
          description: 'A modern web app built with React.',
          image: '/images/project1.jpg',
          link: 'https://example.com',
          category: 'web',
        },
        {
          id:'2',
          title: 'Project Two',
          description: 'A branding project for a startup.',
          image: '/images/project2.jpg',
          link: 'https://example.com',
          category: 'design',
        },
      ]);
    }, 1000);
  });
};