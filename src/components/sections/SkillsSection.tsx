import React, { useEffect, useRef } from 'react';
import styles from '../../styles/components/SkillsSection.module.css';
import { FaTools } from 'react-icons/fa';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const SkillsSection: React.FC = () => {
  const skillsSectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // GSAP Animation for skill cards
    if (skillsSectionRef.current) {
      const skillCards = skillsSectionRef.current.querySelectorAll(`.${styles.skillCard}`);
      gsap.fromTo(
        skillCards,
        { opacity: 0, y: 30, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: skillsSectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Three.js Earth-Shaped Particle System with Background Stars
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 600, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, 600);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 4));

    // Earth Particle System
    const particleCount = 1500;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const time = new Float32Array(particleCount);

    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load(
      'https://threejsfundamentals.org/threejs/resources/images/star.png'
    );

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = 2 * Math.PI * Math.random();
      const radius = 15 + (Math.random() - 0.5) * 0.5;

      positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(theta);

      const isLand = Math.random() < 0.3;
      const isCloud = Math.random() < 0.2;
      if (isCloud) {
        colors[i * 3] = 0.9;
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 0.9;
      } else if (isLand) {
        colors[i * 3] = 0.1;
        colors[i * 3 + 1] = Math.random() * 0.3 + 0.2;
        colors[i * 3 + 2] = 0.1;
      } else {
        colors[i * 3] = 0.1;
        colors[i * 3 + 1] = Math.random() * 0.2 + 0.1;
        colors[i * 3 + 2] = Math.random() * 0.4 + 0.4;
      }

      sizes[i] = Math.random() * 0.3 + 0.1;
      time[i] = Math.random() * 2 * Math.PI;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particlesGeometry.setAttribute('time', new THREE.BufferAttribute(time, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: particleTexture },
        uTime: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        attribute float time;
        varying vec3 vColor;
        uniform float uTime;
        void main() {
          vColor = color;
          float scale = size * (0.8 + 0.2 * sin(uTime + time));
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = scale * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec3 vColor;
        void main() {
          gl_FragColor = vec4(vColor, 1.0) * texture2D(uTexture, gl_PointCoord);
          float intensity = 1.0 - length(gl_PointCoord - 0.5) * 2.0;
          gl_FragColor.rgb += 0.2 * intensity;
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particles);

    // Background Stars Particle System
    const starCount = 1000;
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starVelocities = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starTime = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      // Distribute stars in a larger sphere
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = 2 * Math.PI * Math.random();
      const radius = 50 + Math.random() * 20; // Farther than Earth

      starPositions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      starPositions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      starPositions[i * 3 + 2] = radius * Math.cos(theta);

      // Random small velocities for movement
      starVelocities[i * 3] = (Math.random() - 0.5) * 0.01;
      starVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      starVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

      starSizes[i] = Math.random() * 0.2 + 0.05;
      starTime[i] = Math.random() * 2 * Math.PI;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeometry.setAttribute('velocity', new THREE.BufferAttribute(starVelocities, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    starsGeometry.setAttribute('time', new THREE.BufferAttribute(starTime, 1));

    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: particleTexture },
        uTime: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        attribute float time;
        attribute vec3 velocity;
        varying vec3 vColor;
        uniform float uTime;
        void main() {
          vColor = vec3(1.0, 1.0, 1.0); // White stars
          vec3 newPosition = position + velocity * uTime; // Move stars
          float scale = size * (1.9 + 0.1 * sin(uTime + time)); // Twinkling
          vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
          gl_PointSize = scale * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec3 vColor;
        void main() {
          gl_FragColor = vec4(vColor, 0.6) * texture2D(uTexture, gl_PointCoord); // Lower opacity
          float intensity = 1.0 - length(gl_PointCoord - 0.5) * 2.0;
          gl_FragColor.rgb += 0.1 * intensity; // Subtle glow
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    });

    const stars = new THREE.Points(starsGeometry, starMaterial);
    scene.add(stars);

    camera.position.z = 30;
    camera.position.y = 5;

    let frame = 0;
    const animateParticles = () => {
      frame = requestAnimationFrame(animateParticles);

      particles.rotation.y += 0.002;
      particleMaterial.uniforms.uTime.value += 0.05;
      starMaterial.uniforms.uTime.value += 0.05; // Update time for stars

      renderer.render(scene, camera);
    };

    animateParticles();

    const handleResize = () => {
      camera.aspect = window.innerWidth / 600;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, 600);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frame);
      renderer.dispose();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const skills = [
    { name: 'React', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/react.svg' },
    { name: 'Angular', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/angular.svg' },
    { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/spring.svg' },
    { name: 'Android', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/android.svg' },
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nodedotjs.svg' },
    { name: 'Docker', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/docker.svg' },
    { name: 'Cybersecurity', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/cisco.svg' },
  ];

  return (
    <div className={styles.skillsSection} ref={skillsSectionRef}>
      <canvas ref={canvasRef} className={styles.particleCanvas} />
      <h2 className={styles.skillsTitle}>
        <FaTools className={styles.skillsIcon} /> Tech Toolbox
      </h2>
      <div className={styles.skillsGrid}>
        {skills.map((skill, index) => (
          <div key={index} className={styles.skillCard}>
            <div className={styles.skillCardInner}>
              <img src={skill.icon} alt={`${skill.name} icon`} className={styles.skillIcon} />
              <div className={styles.skillOverlay}>
                <span className={styles.skillName}>{skill.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;