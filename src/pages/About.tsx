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
      opacity: 0.7,
      vertexColors: true,
    });

    const particles = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particles);

    camera.position.z = 50;
    camera.position.y = 5;
    let angle = 0;

    const animateParticles = () => {
      requestAnimationFrame(animateParticles);
      const positionsAttr = particles.geometry.attributes.position;
      const array = positionsAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        array[i * 3 + 1] -= velocities[i];
        if (array[i * 3 + 1] < -30) array[i * 3 + 1] += 60;
      }

      angle += 0.01;
      camera.position.x = 10 * Math.sin(angle);
      camera.position.z = 50 + 5 * Math.cos(angle);
      camera.lookAt(0, 0, 0);

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

  const handleCvDownload = () => {
    const cvUrl = 'https://gkogquqptohjirdxwxhh.supabase.co/storage/v1/object/sign/resumedata/Malinga%20Samarakoon.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzY2MTZlZGNhLTE3NDMtNDQ5Mi04YWMyLWJkOTAzNDA3YTkyZSJ9.eyJ1cmwiOiJyZXN1bWVkYXRhL01hbGluZ2EgU2FtYXJha29vbi5wZGYiLCJpYXQiOjE3NDcxNjIzOTAsImV4cCI6MTg0MTc3MDM5MH0.h732DqfuTS22Lv6zAEzJgeTbU4rM5yso6SC-952nJRU';
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = 'Malinga_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const socialLinks = [
    { icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gmail.svg', url: 'mailto:malinga_samarakoon@outlook.com' },
    { icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg', url: 'https://www.linkedin.com/in/malinga-samarakoon-b8333527b/' },
    { icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/stackoverflow.svg', url: 'https://stackoverflow.com/users/28654830/user28654830' },
  ];

  return (
    <main className={`${styles.about} ${theme === 'light' ? styles.light : ''}`}>
      <canvas ref={canvasRef} className={styles.particleCanvas} />
      <div className={styles.contentWrapper}>
        <section ref={bioRef} className={styles.bio}>
          <h1 className={styles.sectionTitle}>About Me</h1>
          <div ref={profilePicRef} className={`${styles.profilePic} ${styles.imageSection}`}>
            <img src={profile} alt="Profile Picture" className={styles.profileImage} />
            <div className={styles.glowRing}></div>
          </div>
          <div className={styles.bioContent}>
            <div className={styles.essay}>
              <p className={styles.sectionText}>
                From a very young age, I have been fascinated by computers—not merely as tools for entertainment or gaming but as incredible machines with the power to build, solve, and innovate. My curiosity about how things work behind the screen led me to explore the inner workings of websites, applications, and software. While many children of my age spent their time purely on games, I found myself wanting to understand how those games were made, how websites functioned, and how technology could be used to create meaningful experiences. However, like many journeys in life, mine wasn't straightforward or without detours.
              </p>



            </div>
            <div className={styles.imageSection}>
              {/* Image is already placed above, this section can be empty or used for additional content if needed */}
            </div>
          </div>
          <div className={styles.essayFull}>
                          <p className={`${styles.sectionText} mt-6`}>
                Growing up, I didn’t have a structured path or much guidance in pursuing computer science formally. Despite my strong interest in the digital world, I ended up selecting the Biological Science stream for my Advanced Level (A/L) studies. This decision wasn’t necessarily due to a lack of passion for technology but rather a combination of circumstances, limited information, and the availability of academic options at the time. As a playful boy immersed in various interests and the rhythm of school life, I didn’t realize early on that my true calling was rooted in technology. Time passed quickly, and before I knew it, I had completed my A/L examinations in the biological stream.
              </p>

                          <p className={`${styles.sectionText} mt-6`}>
                However, the desire to learn about computers never left me. Even during my school years, I often dabbled in basic web development and tinkered with whatever technology I could get my hands on. I used to build simple websites just for fun, teaching myself the basics of HTML, CSS, and JavaScript through online tutorials. I found this process deeply satisfying—it gave me a sense of achievement and creative fulfillment that I rarely felt in my other academic subjects.
              </p>
                          <p className={`${styles.sectionText} mt-6`}>
                After my A/Ls, I was fortunate enough to gain admission to the University of Peradeniya, one of the most prestigious universities in Sri Lanka. Although I had entered the university under the Biological Science stream, the institution provided a rare opportunity for students like me to branch into Computer Science. Without hesitation, I seized this chance. It was the perfect turning point in my academic life—a moment where I could finally align my academic path with my lifelong passion.
              </p>
                          <p className={`${styles.sectionText} mt-6`}>
                Today, I am a dedicated Computer Science undergraduate at the University of Peradeniya, driven by a strong desire to use technology to solve real-world problems. Transitioning from biology to computer science was not easy. I had to work harder than many of my peers to bridge the knowledge gap. I invested countless hours reading textbooks, following online courses, building personal projects, and, most importantly, never giving up even when things got tough. What fueled this relentless effort was my unwavering passion for technology.
              </p>
            <p className={`${styles.sectionText} mt-6`}>
              Since 2022, I have also worked as a freelancing web developer, taking on real-world projects that allowed me to apply what I learned in a practical context. Freelancing not only honed my technical skills but also taught me essential soft skills like time management, client communication, and problem-solving under pressure. Through these projects, I gained hands-on experience in building scalable, user-friendly, and performance-optimized web applications.
            </p>
            <p className={`${styles.sectionText} mt-6`}>
              My technical toolkit includes React, Angular, Node.js, Express, MongoDB, and the MERN stack. I enjoy creating dynamic front-end interfaces as well as robust back-end systems. Working with the MERN stack has given me a holistic understanding of full-stack development, and I often find joy in solving complex bugs, designing intuitive user interfaces, and optimizing application performance. I believe that great digital experiences are not just about writing code, but about understanding the user’s perspective and delivering solutions that matter.
            </p>
            <p className={`${styles.sectionText} mt-6`}>
              My university journey has also opened the doors to many exciting opportunities. I have worked on academic projects that involve data analysis, artificial intelligence, and mobile application development. These experiences have allowed me to explore different areas of computer science and develop a multidisciplinary perspective. I am particularly fascinated by how software intersects with other domains like healthcare, education, and sustainability. This cross-domain applicability makes computer science one of the most powerful tools for creating meaningful change in the world.
            </p>
            <p className={`${styles.sectionText} mt-6`}>
              Looking ahead, my goal is to become a software engineer who not only writes efficient code but also creates products that impact lives. I aim to work in an environment that challenges me, encourages innovation, and allows me to grow both personally and professionally. Whether it’s building modern web apps, developing AI-driven systems, or contributing to open-source projects, I want my work to be meaningful. I am particularly interested in the intersection of AI and web technologies, and I plan to delve deeper into this area through both academic research and practical application.
            </p>
            <p className={`${styles.sectionText} mt-6`}>
              In addition to my academic and technical pursuits, I am also committed to community and knowledge sharing. I often help my peers with debugging code, setting up development environments, and understanding complex concepts. I believe that collaboration and mentorship are essential in the tech field. By contributing to others’ learning, I also deepen my own understanding and develop leadership skills that will serve me well in the future.
            </p>
            <button className={styles.downloadButton} onClick={handleCvDownload}>
              Download CV
            </button>
            <div className={styles.socialLinks}>
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={`Link to ${link.url.split('/')[2]} profile`}
                >
                  <img src={link.icon} alt={`${link.url.split('/')[2]} icon`} />
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default About;