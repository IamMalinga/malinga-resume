import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/components/Hero.module.css';
import Button from '../common/Button';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Profile from '../../assets/profile.jpg'; // Replace with your actual profile image path
import * as THREE from 'three';
import { useTheme } from '../../hooks/useTheme';
import TopProjects from './TopProjects';
import ContactForm from './ContactForm'; // Import the new ContactForm component
import SkillsSection from './SkillsSection'; // Import the new SkillsSection component

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contactButtonRef = useRef<HTMLButtonElement>(null);
  const ripple1Ref = useRef<HTMLDivElement>(null);
  const ripple2Ref = useRef<HTMLDivElement>(null);
  const ripple3Ref = useRef<HTMLDivElement>(null);
  const rippleTopLeft1Ref = useRef<HTMLDivElement>(null);
  const rippleTopLeft2Ref = useRef<HTMLDivElement>(null);
  const rippleTopLeft3Ref = useRef<HTMLDivElement>(null);
  const rippleBottomRight1Ref = useRef<HTMLDivElement>(null);
  const rippleBottomRight2Ref = useRef<HTMLDivElement>(null);
  const rippleBottomRight3Ref = useRef<HTMLDivElement>(null);
  const socialLinksRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const tl = gsap.timeline();

    const titleText = titleRef.current?.innerText || 'Hello!, I am Malinga.';
    const chars = titleText.split(' ');
    titleRef.current!.innerHTML = chars
      .map(char => `<span class="${styles.char}">${char}</span>`)
      .join(' ');

    tl.fromTo(
      titleRef.current!.querySelectorAll(`.${styles.char}`),
      { opacity: 0, y: 20, scale: 0.9, rotateX: 90 },
      { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 1.5, stagger: 0.07, ease: 'power3.out' }
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' },
        '-=0.7'
      )
      .fromTo(
        buttonRef.current,
        { opacity: 0, scale: 0.5, rotateY: 180 },
        { opacity: 1, scale: 1, rotateY: 0, duration: 1.5, ease: 'elastic.out(1, 0.5)' },
        '-=0.5'
      )
      .fromTo(
        socialLinksRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo(
        contactButtonRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      );

    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const particleCount = 500;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      velocities[i] = Math.random() * 0.015 + 0.01;

      if (theme === 'light') {
        colors[i * 3] = Math.random() * 0.5 + 0.5;
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = Math.random() * 0.5 + 0.5;
      } else {
        colors[i * 3] = 0;
        colors[i * 3 + 1] = Math.random() * 0.5 + 0.5;
        colors[i * 3 + 2] = Math.random() * 0.5 + 0.5;
      }
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.2,
      transparent: true,
      opacity: 0.9,
      vertexColors: true,
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

    const rippleAnimation = (ripple: HTMLDivElement | null, delay: number) => {
      if (ripple) {
        gsap.fromTo(
          ripple,
          { scale: 0, opacity: 0.5 },
          {
            scale: 2.5,
            opacity: 0,
            duration: 3,
            ease: 'power1.out',
            repeat: -1,
            delay,
          }
        );
      }
    };

    rippleAnimation(ripple1Ref.current, 0);
    rippleAnimation(ripple2Ref.current, 1);
    rippleAnimation(ripple3Ref.current, 2);
    rippleAnimation(rippleTopLeft1Ref.current, 0.5);
    rippleAnimation(rippleTopLeft2Ref.current, 1.5);
    rippleAnimation(rippleTopLeft3Ref.current, 2.5);
    rippleAnimation(rippleBottomRight1Ref.current, 0.8);
    rippleAnimation(rippleBottomRight2Ref.current, 1.8);
    rippleAnimation(rippleBottomRight3Ref.current, 2.8);

    ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => gsap.to(heroRef.current, { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }),
      onLeaveBack: () => gsap.to(heroRef.current, { opacity: 0.7, scale: 0.95, duration: 1, ease: 'power2.out' }),
      toggleActions: 'play reverse play reverse',
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf([
        ripple1Ref.current, ripple2Ref.current, ripple3Ref.current,
        rippleTopLeft1Ref.current, rippleTopLeft2Ref.current, rippleTopLeft3Ref.current,
        rippleBottomRight1Ref.current, rippleBottomRight2Ref.current, rippleBottomRight3Ref.current
      ]);
    };
  }, []);

  const socialLinks = [
    { name: 'Email', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gmail.svg', url: 'mailto:malinga_samarakoon@outlook.com' },
    { name: 'LinkedIn', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg', url: 'https://www.linkedin.com/in/malinga-samarakoon-b8333527b/' },
    { name: 'StackOverflow', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/stackoverflow.svg', url: 'https://stackoverflow.com/users/28654830/user28654830' },
    { name: 'HackerRank', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/hackerrank.svg', url: 'https://www.hackerrank.com/profile/malinga_samarak1' },
    { name: 'Dev', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/devdotto.svg', url: 'https://dev.to/malinga' },
  ];

  const handleCvDownload = () => {
    const cvUrl = 'https://gkogquqptohjirdxwxhh.supabase.co/storage/v1/object/sign/resumedata/Malinga%20Samarakoon.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzY2MTZlZGNhLTE3NDMtNDQ5Mi04YWMyLWJkOTAzNDA3YTkyZSJ9.eyJ1cmwiOiJyZXN1bWVkYXRhL01hbGluZ2EgU2FtYXJha29vbi5wZGYiLCJpYXQiOjE3NDcxNjIzOTAsImV4cCI6MTg0MTc3MDM5MH0.h732DqfuTS22Lv6zAEzJgeTbU4rM5yso6SC-952nJRU';
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = 'Malinga_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleContactClick = () => {
    setIsModalOpen(true);
  };

  return (
    <section className={styles.hero} ref={heroRef} aria-label="Hero Section with Profile Introduction">
      <canvas ref={canvasRef} className={styles.particleCanvas} />
      <div className={styles.heroContainer}>
        <div className={styles.textContent}>
          <h1
            ref={titleRef}
            className={`${styles.title} text-4xl md:text-6xl font-bold mb-6 leading-tight`}
          >
            Hello!,
            
            
          </h1>
          <h1 className={`${styles.title} text-4xl md:text-6xl font-bold mb-6 leading-tight`}>
            I am  Malinga.
          </h1>
          <p
            ref={subtitleRef}
            className={`${styles.subtitle} text-lg md:text-xl max-w-2xl mb-8`}
          >
            This is my personal portfolio showcasing my journey as a passionate developer. I specialize in crafting robust applications using technologies like React, Angular, and Spring Boot, while ensuring scalability through DevOps practices and security with a focus on cybersecurity. Explore my projects to see how I turn ideas into impactful, secure, and scalable solutions!
          </p>
          <Button
            ref={buttonRef}
            variant="primary"
            onClick={handleCvDownload}
            className={`${styles.button} px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-300`}
            aria-label="Download CV"
          >
            View My CV
          </Button>
        </div>
        <div className={styles.rippleContainer}>
          <div ref={ripple1Ref} className={styles.ripple}></div>
          <div ref={ripple2Ref} className={styles.ripple}></div>
          <div ref={ripple3Ref} className={styles.ripple}></div>
        </div>
        <div className={`${styles.rippleContainer} ${styles.rippleTopLeft}`}>
          <div ref={rippleTopLeft1Ref} className={styles.ripple}></div>
          <div ref={rippleTopLeft2Ref} className={styles.ripple}></div>
          <div ref={rippleTopLeft3Ref} className={styles.ripple}></div>
        </div>
        <div className={`${styles.rippleContainer} ${styles.rippleBottomRight}`}>
          <div ref={rippleBottomRight1Ref} className={styles.ripple}></div>
          <div ref={rippleBottomRight2Ref} className={styles.ripple}></div>
          <div ref={rippleBottomRight3Ref} className={styles.ripple}></div>
        </div>
        <div className={styles.profileSection}>
          <div className={styles.imageContent}>
            <div className={styles.profileImageContainer}>
              <img
                src={Profile}
                alt="Malinga's Profile"
                className={styles.profileImage}
              />
              <button
                ref={contactButtonRef}
                className={styles.contactButton}
                onClick={handleContactClick}
                aria-label="Open contact form"
              >
                <i className="fas fa-envelope"></i>
              </button>
            </div>
            <div className={styles.socialLinksContainer} ref={socialLinksRef}>
              <h3 className={styles.socialLinksTitle}>Find Me Online</h3>
              <div className={styles.socialLinks}>
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label={`Link to ${link.name} profile`}
                  >
                    <img src={link.icon} alt={`${link.name} icon`} className={styles.socialIcon} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ContactForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <TopProjects />
      <SkillsSection />
    </section>
  );
};

export default Hero;