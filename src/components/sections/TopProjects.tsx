import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/components/TopProjects.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import supabase from '../../utils/supabase';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  description: string[];
  created_at: string;
  url: string | null;
  live_demo_url: string | null;
  is_top_project: boolean;
  image_urls: string[] | null;
}

const TopProjects: React.FC = () => {
  const projectsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopProjects = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, start_date, end_date, location, description, created_at, url, live_demo_url, is_top_project, image_urls')
          .eq('is_top_project', true)
          .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);

        const formattedData = (data as Project[]).map(project => ({
          ...project,
          description: project.description.map(item => {
            try {
              const parsed = JSON.parse(item);
              return typeof parsed === 'object' && parsed.text ? parsed.text : item;
            } catch {
              return item;
            }
          }),
        }));
        setProjects(formattedData);
      } catch (err) {
        setError('Failed to fetch top projects. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProjects();
  }, []);

  useEffect(() => {
    if (!projectsRef.current || !titleRef.current || !canvasRef.current) return;

    const ctx = gsap.context(() => {

      const projectCards = projectsRef.current
        ? projectsRef.current.querySelectorAll(`.${styles.projectCard}`)
        : [];
      gsap.fromTo(
        projectCards,
        { opacity: 0, y: 50, rotationX: 15, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.4,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: projectsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, projectsRef);

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const particleCount = 400;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
      velocities[i] = Math.random() * 0.03 + 0.01;
      sizes[i] = Math.random() * 0.8 + 0.2;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xffffff) },
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float distance = length(gl_PointCoord - vec2(0.5));
          if (distance > 0.5) discard;
          gl_FragColor = vec4(vColor, 0.8);
        }
      `,
      transparent: true,
    });

    const particles = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particles);
    camera.position.z = 60;

    let animationId: number;
    const animateParticles = () => {
      animationId = requestAnimationFrame(animateParticles);
      const posArray = particlesGeometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] -= velocities[i];
        if (posArray[i * 3 + 1] < -60) posArray[i * 3 + 1] += 120;
      }

      particlesGeometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animateParticles();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      ctx.revert();
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      particlesGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [projects]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        Loading top projects...
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (projects.length === 0) {
    return <div className={styles.noProjects}>No top projects available.</div>;
  }

  return (
    <div className={styles.topProjects} ref={projectsRef}>
      <canvas ref={canvasRef} className={styles.particleCanvas} />
      <h2 ref={titleRef} className={styles.title}>Top Projects</h2>
      <div className={styles.projectsGrid}>
        {projects.slice(0, 3).map((project) => (
          <div key={project.id} className={styles.projectCard}>
            <div className={styles.projectImageContainer}>
              <img
                src={project.image_urls?.[0] ?? '/placeholder-image.jpg'}
                alt={`${project.title} screenshot`}
                className={styles.projectImage}
              />
            </div>
            <div className={styles.projectContent}>
              <div className={styles.date}>
                <FaCalendarAlt className={styles.icon} />
                {project.start_date ? `${new Date(project.start_date).toLocaleString('default', { month: 'short' })} ${new Date(project.start_date).getFullYear()}` : ''} -{' '}
                {project.end_date ? `${new Date(project.end_date).toLocaleString('default', { month: 'short' })} ${new Date(project.end_date).getFullYear()}` : 'Present'}
              </div>
              {project.url ? (
                <strong>
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.projectTitleLink}>
                    {project.title}
                  </a>
                </strong>
              ) : (
                <strong className={styles.projectTitle}>{project.title}</strong>
              )}
              {project.location && (
                <div className={styles.location}>
                  <FaMapMarkerAlt className={styles.icon} />
                  {project.location}
                </div>
              )}
              {project.description.length > 0 ? (
                <ul className={styles.jobList}>
                  {project.description.map((desc, index) => (
                    <li key={index}>{desc}</li>
                  ))}
                </ul>
              ) : (
                <p>No project description available.</p>
              )}
            </div>
            <div className={styles.links}>
              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  Project Details
                </a>
              )}
              {project.live_demo_url && (
                <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  Live Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProjects;