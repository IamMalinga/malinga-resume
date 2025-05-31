import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/components/Hero.module.css';
import Button from '../common/Button';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Profile from '../../assets/profile.jpg'; // Replace with your actual profile image path
import { FaTools } from 'react-icons/fa'; // You can choose any icon
import * as THREE from 'three';
import { useTheme } from '../../hooks/useTheme';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contactButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  // Ripple refs for the center position
  const ripple1Ref = useRef<HTMLDivElement>(null);
  const ripple2Ref = useRef<HTMLDivElement>(null);
  const ripple3Ref = useRef<HTMLDivElement>(null);
  // Ripple refs for top-left position
  const rippleTopLeft1Ref = useRef<HTMLDivElement>(null);
  const rippleTopLeft2Ref = useRef<HTMLDivElement>(null);
  const rippleTopLeft3Ref = useRef<HTMLDivElement>(null);
  // Ripple refs for bottom-right position
  const rippleBottomRight1Ref = useRef<HTMLDivElement>(null);
  const rippleBottomRight2Ref = useRef<HTMLDivElement>(null);
  const rippleBottomRight3Ref = useRef<HTMLDivElement>(null);
  // Skills section ref
  const skillsSectionRef = useRef<HTMLDivElement>(null);
  // Social links container ref
  const socialLinksRef = useRef<HTMLDivElement>(null);
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();



  useEffect(() => {
    // GSAP animation for text, button, and contact button on load
    const tl = gsap.timeline();

    const titleText = titleRef.current?.innerText || '';
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

    // GSAP animation for modal
    if (isModalOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.2 },
        { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }
      );
    }


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
        const colors = new Float32Array(particleCount * 6); // Add color variation
    
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
          opacity: 0.9,
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
    




    // Ripple animation function
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

    // Center ripples
    rippleAnimation(ripple1Ref.current, 0);
    rippleAnimation(ripple2Ref.current, 1);
    rippleAnimation(ripple3Ref.current, 2);

    // Top-left ripples
    rippleAnimation(rippleTopLeft1Ref.current, 0.5);
    rippleAnimation(rippleTopLeft2Ref.current, 1.5);
    rippleAnimation(rippleTopLeft3Ref.current, 2.5);

    // Bottom-right ripples
    rippleAnimation(rippleBottomRight1Ref.current, 0.8);
    rippleAnimation(rippleBottomRight2Ref.current, 1.8);
    rippleAnimation(rippleBottomRight3Ref.current, 2.8);

    // ScrollTrigger animation for hero section
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => gsap.to(heroRef.current, { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }),
      onLeaveBack: () => gsap.to(heroRef.current, { opacity: 0.7, scale: 0.95, duration: 1, ease: 'power2.out' }),
      toggleActions: 'play reverse play reverse',
    });

    // GSAP animation for skill cards
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


    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf([
        ripple1Ref.current, ripple2Ref.current, ripple3Ref.current,
        rippleTopLeft1Ref.current, rippleTopLeft2Ref.current, rippleTopLeft3Ref.current,
        rippleBottomRight1Ref.current, rippleBottomRight2Ref.current, rippleBottomRight3Ref.current
      ]);
    };
  }, [isModalOpen]);

  const skills = [
    { name: 'React', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/react.svg' },
    { name: 'Angular', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/angular.svg' },
    { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/spring.svg' },
    { name: 'Android', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/android.svg' },
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nodedotjs.svg' },
    { name: 'Docker', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/docker.svg' },
    { name: 'Cybersecurity', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/cisco.svg' },
  ];

  const socialLinks = [
    { name: 'Email', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gmail.svg', url: 'mailto:your.email@example.com' },
    { name: 'LinkedIn', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg', url: 'https://www.linkedin.com/in/yourprofile' },
    { name: 'StackOverflow', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/stackoverflow.svg', url: 'https://stackoverflow.com/users/yourprofile' },
    { name: 'HackerRank', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/hackerrank.svg', url: 'https://www.hackerrank.com/yourprofile' },
    { name: 'Dev', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/devdotto.svg', url: 'https://dev.to/yourprofile' },
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

  const handleCloseModal = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => setIsModalOpen(false),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder for form submission logic
    console.log('Form submitted');
    handleCloseModal();
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
            Hello!, I am Malinga.
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
        {/* Center ripple container */}
        <div className={styles.rippleContainer}>
          <div ref={ripple1Ref} className={styles.ripple}></div>
          <div ref={ripple2Ref} className={styles.ripple}></div>
          <div ref={ripple3Ref} className={styles.ripple}></div>
        </div>
        {/* Top-left ripple container */}
        <div className={`${styles.rippleContainer} ${styles.rippleTopLeft}`}>
          <div ref={rippleTopLeft1Ref} className={styles.ripple}></div>
          <div ref={rippleTopLeft2Ref} className={styles.ripple}></div>
          <div ref={rippleTopLeft3Ref} className={styles.ripple}></div>
        </div>
        {/* Bottom-right ripple container */}
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
      {/* Contact Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} ref={modalRef}>
            <button
              className={styles.closeButton}
              onClick={handleCloseModal}
              aria-label="Close contact form"
            >
              <i className="fas fa-times"></i>
            </button>
            <h2 className={styles.modalTitle}>Contact Me</h2>
            <form className={styles.contactForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Your Name"
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="Your Email"
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Your Message"
                  className={styles.formTextarea}
                ></textarea>
              </div>
              <button
                type="submit"
                className={`${styles.submitButton} px-6 py-2 text-lg font-semibold rounded-full`}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Skills Section */}
      <div className={styles.skillsSection} ref={skillsSectionRef}>
        <h2 className={styles.skillsTitle}><FaTools className={styles.skillsIcon} />Tech Toolbox</h2>
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
    </section>
  );
};

export default Hero;