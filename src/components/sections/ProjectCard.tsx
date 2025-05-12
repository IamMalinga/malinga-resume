import React, { useEffect, useRef } from 'react';
import styles from '../../styles/components/ProjectCard.module.css';
import { gsap } from 'gsap';
import { useTheme } from '../../hooks/useTheme'; // Assuming this hook exists

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tech: string[];
  duration: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }
    );
  }, []);

  return (
    <div ref={cardRef} className={`${styles.card} ${theme === 'light' ? styles.light : ''}`}>
      <h3 className={styles.title}>{project.title}</h3>
      <p className={styles.duration}>{project.duration}</p>
      <p className={styles.description}>{project.description}</p>
      <div className={styles.tech}>
        {project.tech.map((tech, index) => (
          <span key={index} className={styles.techTag}>
            {tech}
          </span>
        ))}
      </div>
      <div className={styles.category}>{project.category}</div>
    </div>
  );
};

export default ProjectCard;