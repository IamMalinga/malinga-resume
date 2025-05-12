import React, { useEffect, useRef } from 'react';
import ContactForm from '../components/sections/ContactForm';
import styles from '../styles/components/Contact.module.css';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme'; // Assuming this hook exists

const Contact: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    // GSAP animations
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'back.out(1.7)' }
    );
    gsap.fromTo(
      socialRef.current ? Array.from(socialRef.current.children) : [],
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out' }
    );

    // Three.js particle background
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const particleCount = 400;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      velocities[i] = Math.random() * 0.015 + 0.01;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));

    const particleMaterial = new THREE.PointsMaterial({
      color: theme === 'light' ? 0xff00cc : 0x00ffcc,
      size: 0.15,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particles);

    camera.position.z = 60;

    const animateParticles = () => {
      requestAnimationFrame(animateParticles);
      const positionsAttr = particles.geometry.attributes.position;
      const array = positionsAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        array[i * 3 + 1] -= velocities[i];
        if (array[i * 3 + 1] < -30) array[i * 3 + 1] += 60;
      }

      positionsAttr.needsUpdate = true;
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
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [theme]);

  return (
    <main className={`${styles.contact} ${theme === 'light' ? styles.light : ''}`}>
      <canvas ref={canvasRef} className={styles.particleCanvas} />
      <h1 ref={titleRef} className={styles.title}>Get in Touch</h1>
      <div ref={formRef}>
        <ContactForm />
      </div>
      <div ref={socialRef} className={styles.socialLinks}>
        <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
          <i className="fab fa-linkedin-in"></i>
        </a>
        <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
          <i className="fab fa-github"></i>
        </a>
        <a href="mailto:your.email@example.com" className={styles.socialLink}>
          <i className="fas fa-envelope"></i>
        </a>
        <a href="https://dev.to/yourprofile" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
          <i className="fab fa-dev"></i>
        </a>
        <a href="https://stackoverflow.com/users/yourprofile" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
          <i className="fab fa-stack-overflow"></i>
        </a>
      </div>
    </main>
  );
};

export default Contact;