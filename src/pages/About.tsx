import React, { useEffect, useRef } from 'react';
import styles from '../styles/components/About.module.css';
import profile from '../assets/profile.jpg';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';


const About: React.FC = () => {
  const bioRef = useRef<HTMLDivElement>(null);
  const credentialsRef = useRef<HTMLDivElement>(null);
  const profilePicRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    // GSAP animations
    const tl = gsap.timeline();

    tl.fromTo(
      bioRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.5)' }
    )
      .fromTo(
        credentialsRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.5)' },
        '-=0.8'
      )
      .fromTo(
        profilePicRef.current,
        { opacity: 0, scale: 0.8, rotation: -10 },
        { opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: 'back.out(1.7)' },
        '-=0.8'
      )
      .fromTo(
        '.credentialsList li',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.2, ease: 'power2.out' },
        '-=0.8'
      );

    // Three.js particle background with enhanced depth
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const particleCount = 500; // Increased for more depth
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3); // Add color variation

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      velocities[i] = Math.random() * 0.015 + 0.01;

      // Color gradient based on theme
      if (theme === 'light') {
        colors[i * 3] = Math.random() * 0.5 + 0.5; // R (pinkish tones)
        colors[i * 3 + 1] = 0; // G
        colors[i * 3 + 2] = Math.random() * 0.5 + 0.5; // B
      } else {
        colors[i * 3] = 0; // R
        colors[i * 3 + 1] = Math.random() * 0.5 + 0.5; // G (cyan tones)
        colors[i * 3 + 2] = Math.random() * 0.5 + 0.5; // B
      }
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.2,
      transparent: true,
      opacity: 0.7,
      vertexColors: true, // Enable vertex colors for gradient effect
    });

    const particles = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particles);

    camera.position.z = 50;

    

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
    <main className={`${styles.about} ${theme === 'light' ? styles.light : ''}`}>
      <canvas ref={canvasRef} className={styles.particleCanvas} />
      <div className={styles.contentWrapper}>
        <section ref={bioRef} className={styles.bio}>
          <h1 className={styles.sectionTitle}>About Me</h1>
          <p className={styles.sectionText}>
            I'm a dedicated Computer Science undergraduate at the University of
            Peradeniya, passionate about leveraging technology to drive innovation.
            With hands-on experience as a Freelancing Web Developer since 2022, I
            specialize in creating scalable and dynamic web solutions using
            technologies like React, Angular, and the MERN stack.
          </p>
          <p className={`${styles.sectionText} mt-4`}>
            My goal is to build impactful digital experiences that solve real-world
            challenges, blending technical expertise with a creative approach to
            development.
          </p>
        </section>
        <section ref={profilePicRef} className={styles.profilePic}>
          <img
            src={profile}
            alt="Profile Picture"
            className={styles.profileImage}
          />
          <div className={styles.glowRing}></div>
        </section>
        <section ref={credentialsRef} className={styles.credentials}>
          <h2 className={styles.sectionTitle}>Credentials</h2>
          <ul className={styles.credentialsList}>
            <li>
              <strong>BSc (Hons) in Computer Science</strong>, University of Peradeniya
              <ul className={styles.subList}>
                <li>Duration: 2021 – 2025 (Expected)</li>
                <li>Major Coursework: Data Structures, Algorithms, Web Development, Database Systems, Machine Learning, Cloud Computing</li>
              </ul>
            </li>
            <li>Certified in Spring Boot 3, IBM DevOps, and Google Cybersecurity Specialization</li>
            <li>AWS Academy Cloud Foundation Course</li>
            <li>Projects: Data Quest, Gym Management System, Real-Time Weather App</li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default About;