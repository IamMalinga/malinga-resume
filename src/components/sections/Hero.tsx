import React, { useEffect, useRef } from 'react';
import styles from '../../styles/components/Hero.module.css';
import Button from '../common/Button';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Profile from '../../assets/profile.jpg'; // Replace with your actual profile image path

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
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

  useEffect(() => {
    // GSAP animation for text and button on load
    const tl = gsap.timeline();

    const titleText = titleRef.current?.innerText || '';
    const chars = titleText.split(' ');
    titleRef.current!.innerHTML = chars
      .map(char => `<span class="${styles.char}">${char}</span>`)
      .join(' ');

    tl.fromTo(
      titleRef.current!.querySelectorAll(`.${styles.char}`),
      { opacity: 0, y: 20, scale: 0.8, rotateX: 90 },
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
        { opacity: 1, scale: 1, rotateY: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)' },
        '-=0.5'
      );

    // Ripple animation function
    const rippleAnimation = (ripple: HTMLDivElement | null, delay: number) => {
      if (ripple) {
        gsap.fromTo(
          ripple,
          { scale: 0, opacity: 0.5 },
          {
            scale: 1.5,
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

  const handleCvDownload = () => {
    const cvUrl = '/malinga samarakoon.pdf'; // Adjust this path to your CV file location in the public directory
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = 'Malinga_CV.pdf'; // Customize the downloaded file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className={styles.hero} ref={heroRef} aria-label="Hero Section with Profile Introduction">
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
            aria-label="Enter the Code"
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
        <div className={styles.imageContent}>
          <img
            src={Profile}
            alt="Malinga's Profile"
            className={styles.profileImage}
          />
        </div>
      </div>
      {/* Skills Section */}
      <div className={styles.skillsSection} ref={skillsSectionRef}>
        <div className={styles.skillsGrid}>
          {skills.map((skill, index) => (
            <div key={index} className={styles.skillCard}>
              <img src={skill.icon} alt={`${skill.name} icon`} className={styles.skillIcon} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;