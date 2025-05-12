import React from 'react';
import Hero from '../components/sections/Hero';
import ProjectCard from '../components/sections/ProjectCard';
import { useProjects } from '../context/ProjectContext.tsx';
import Loader from '../components/common/Loader';
import styles from '../styles/components/Home.module.css';

const Home: React.FC = () => {
  const { projects, loading } = useProjects();

  return (
    <main className={styles.homeContainer}>
      <Hero />
      <section className={styles.featured}>
        <h2 className="text-5xl font-bold text-center mb-20 pb-50">Featured Projects</h2>
        {loading ? (
          <Loader />
        ) : (
          <div className={styles.grid}>
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;