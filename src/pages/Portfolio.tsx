import React, { useEffect, useRef } from 'react';
import styles from '../styles/components/Portfolio.module.css';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';

const Portfolio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const basicsRef = useRef<HTMLDivElement>(null);
  const workRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const coursesRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const sectionRefs = [basicsRef, workRef, educationRef, projectsRef, skillsRef, coursesRef];
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    // GSAP animations
    gsap.fromTo(
      basicsRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
    gsap.fromTo(
      workRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
    );
    gsap.fromTo(
      educationRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.4 }
    );
    gsap.fromTo(
      projectsRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.6 }
    );
    gsap.fromTo(
      skillsRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.8 }
    );
    gsap.fromTo(
      coursesRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 1.0 }
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
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      velocities[i] = Math.random() * 0.015 + 0.01;

      if (theme === 'light') {
        colors[i * 3] = 0.15; // R (#2563eb)
        colors[i * 3 + 1] = 0.38; // G
        colors[i * 3 + 2] = 0.98; // B
      } else {
        colors[i * 3] = 0.38; // R (#60a5fa)
        colors[i * 3 + 1] = 0.65; // G
        colors[i * 3 + 2] = 0.98; // B
      }
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.15,
      transparent: true,
      opacity: 0.6,
      vertexColors: true,
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

    // Scroll tracking for navigation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = sectionRefs.findIndex((ref) => ref.current === entry.target);
          if (entry.isIntersecting) {
            navItemsRef.current[index]?.classList.add(styles.active);
          } else {
            navItemsRef.current[index]?.classList.remove(styles.active);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    sectionRefs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      observer.disconnect();
    };
  }, [theme]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className={styles.portfolio} data-theme={theme}>
      <canvas ref={canvasRef} className={styles.particleCanvas} />
      <nav className={styles.navBar}>
        <ul className={styles.navList}>
          <li>
            <a
              href="#basics"
              ref={(el) => (navItemsRef.current[0] = el)}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(basicsRef);
              }}
            >
              Basics
            </a>
          </li>
          <li>
            <a
              href="#work"
              ref={(el) => (navItemsRef.current[1] = el)}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(workRef);
              }}
            >
              Work
            </a>
          </li>
          <li>
            <a
              href="#education"
              ref={(el) => (navItemsRef.current[2] = el)}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(educationRef);
              }}
            >
              Education
            </a>
          </li>
          <li>
            <a
              href="#projects"
              ref={(el) => (navItemsRef.current[3] = el)}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(projectsRef);
              }}
            >
              Projects
            </a>
          </li>
          <li>
            <a
              href="#skills"
              ref={(el) => (navItemsRef.current[4] = el)}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(skillsRef);
              }}
            >
              Skills
            </a>
          </li>
          <li>
            <a
              href="#courses"
              ref={(el) => (navItemsRef.current[5] = el)}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(coursesRef);
              }}
            >
              Courses
            </a>
          </li>
        </ul>
      </nav>
      <div className={styles.resume}>
        {/* Basics Section */}
        <div ref={basicsRef} id="basics" className={styles.card}>
          <h2 className={styles.sectionTitle}>Basics</h2>
          <div className={styles.details}>
            <p><strong>Name:</strong> Malinga Samarakoon</p>
            <p><strong>Label:</strong> Software Engineer</p>
            <p><strong>Email:</strong> <a href="mailto:malinga_samarakoon@outlook.com">malinga_samarakoon@outlook.com</a></p>
            <p><strong>URL:</strong> <a href="https://github.com/lamMalinga" target="_blank" rel="noopener noreferrer">https://github.com/lamMalinga</a></p>
          </div>
        </div>

        {/* Work Section */}
        <div ref={workRef} id="work" className={styles.card}>
          <h2 className={styles.sectionTitle}>Work</h2>
          <div className={styles.details}>
            <div className={styles.job}>
              <span className={styles.date}>2022 - Present</span>
              <strong>Freelancing Web Developer</strong> | Sri Lanka
              <ul className={styles.jobList}>
                <li>Developed and maintained responsive web applications using React, Angular, and the MERN stack for various clients.</li>
                <li>Designed backend solutions with Node.js, Express.js, MongoDB, and MySQL, focusing on scalability and security.</li>
                <li>Collaborated with clients to gather requirements, provide technical consultations, and deliver customized solutions.</li>
                <li>Integrated APIs and third-party services like Firebase to enhance application functionality.</li>
              </ul>
            </div>
            <div className={styles.job}>
              <span className={styles.date}>2022 - 2023</span>
              <strong>University of Peradeniya | Designer of Science Reporter</strong> | Peradeniya, Sri Lanka
              <ul className={styles.jobList}>
                <li>Designed content for the Science Reporter, contributing to the university's science communication efforts.</li>
                <li>Collaborated with the Science Student Union as a former designer, enhancing visual materials for events.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div ref={educationRef} id="education" className={styles.card}>
          <h2 className={styles.sectionTitle}>Education</h2>
          <div className={styles.details}>
            <div className={styles.educationItem}>
              <strong>University of Peradeniya | BSc (Hons) in Computer Science</strong>
              <p>In Progress | Peradeniya, Sri Lanka | Expected 2025</p>
              <p>Coursework: Object-oriented Programming (Java), Data Structures (Java), Database Management Systems, Computer Architecture, Web Programming I, Operating Systems Concepts, Computer Graphics, Object Oriented Analysis and Design, Server Side Web Programming, Software Engineering, Digital Image Processing, Design and Analysis of Algorithms, Artificial Intelligence, Advanced Computer Networks, Distributed Computing, Computer Vision, Neural Networks and Deep Learning, Software Project Management, Machine Learning</p>
            </div>
            <div className={styles.educationItem}>
              <strong>ST. Thomas' College Matara | GCE Advanced Level</strong>
              <p>2019 | Matara, Sri Lanka</p>
              <p>Stream - Biological Science | Z-Score - 1.3904 | Rank - 136</p>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div ref={projectsRef} id="projects" className={styles.card}>
          <h2 className={styles.sectionTitle}>Projects</h2>
          <div className={styles.details}>
            <div className={styles.job}>
              <span className={styles.date}>Aug 2024 - Oct 2024</span>
              <strong>Data Quest | Interactive Data Collection System</strong> | Peradeniya, Sri Lanka
              <ul className={styles.jobList}>
                <li>Built a system for 200 users at the Faculty of Management using React.js and Firebase.</li>
                <li>Streamlined data collection with secure authentication and efficient database management.</li>
              </ul>
            </div>
            <div className={styles.job}>
              <span className={styles.date}>Mar 2024 - Jun 2024</span>
              <strong>Gym Management System | Web-Based Application</strong>
              <ul className={styles.jobList}>
                <li>Developed a system using PHP, MySQL, HTML, Bootstrap, and JavaScript for gym operations.</li>
                <li>Features include member registration, progress tracking, and admin dashboards for reports.</li>
              </ul>
            </div>
            <div className={styles.job}>
              <span className={styles.date}>Mar 2024 - Jun 2024</span>
              <strong>Tutor's MERN Exam Records Portal | Student Management System</strong>
              <ul className={styles.jobList}>
                <li>Created a MERN-based portal with role-based authentication, OTP verification, and automated Z-score calculation.</li>
                <li>Included features like PDF result generation, blog platform, and video class system with payment integration.</li>
              </ul>
            </div>
            <div className={styles.job}>
              <span className={styles.date}>Apr 2024 - May 2024</span>
              <strong>Malicious File Blocker | Chrome Extension</strong>
              <ul className={styles.jobList}>
                <li>Designed a Chrome extension to scan and block malicious file downloads in real-time.</li>
                <li>Integrated with a backend service to enhance user security during internet browsing.</li>
              </ul>
            </div>
            <div className={styles.job}>
              <span className={styles.date}>Apr 2024 - May 2024</span>
              <strong>Todo Master | Task Management Mobile App</strong>
              <ul className={styles.jobList}>
                <li>Developed an Android app using Java and Firebase with features like task creation and reminders.</li>
                <li>Implemented user authentication, data persistence, and dark mode support for better usability.</li>
              </ul>
            </div>
            <div className={styles.job}>
              <span className={styles.date}>Jan 2024 - Feb 2024</span>
              <strong>Real-Time Weather App | Angular-Based Application</strong>
              <ul className={styles.jobList}>
                <li>Built a weather app using Angular, integrating the OpenWeather API for real-time data.</li>
                <li>Delivered accurate temperature, conditions, and forecasts with a seamless user experience.</li>
              </ul>
            </div>
            <div className={styles.job}>
              <span className={styles.date}>Jan 2023 - Mar 2023</span>
              <strong>Event Registration System | Sinhala and Tamil New Year Games</strong> | Peradeniya, Sri Lanka
              <ul className={styles.jobList}>
                <li>Developed a web app using the MERN stack with JWT authentication for event registration.</li>
                <li>Independently managed the project, showcasing skills in full-stack development and scalable solutions.</li>
              </ul>
            </div>
            <div className={styles.job}>
              <span className={styles.date}>2023 - 2024</span>
              <strong>DevOps Capstone Project | IBM Certification Project</strong>
              <ul className={styles.jobList}>
                <li>Designed and deployed a full-stack website to the cloud using Docker, Kubernetes, and Openshift.</li>
                <li>Gained expertise in DevOps, Agile methodologies, and application security enhancement.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div ref={skillsRef} id="skills" className={styles.card}>
          <h2 className={styles.sectionTitle}>Skills</h2>
          <div className={styles.details}>
            <div className={styles.skillCategory}>
              <strong>Languages:</strong> JavaScript, Java, Python, C, C++, PHP, SQL
            </div>
            <div className={styles.skillCategory}>
              <strong>Technologies & Libraries:</strong> React, Angular, Spring Boot, Node.js, React Native, Flask
            </div>
            <div className={styles.skillCategory}>
              <strong>Concepts & Methodologies:</strong> Full-Stack Development, DevOps Practices, Web Security, Agile Development, API Integration, Database Management
            </div>
          </div>
        </div>

        {/* Courses and Certifications Section */}
        <div ref={coursesRef} id="courses" className={styles.card}>
          <h2 className={styles.sectionTitle}>Courses and Certifications</h2>
          <div className={styles.details}>
            <div className={styles.course}>
              <strong>AWS Academy Cloud Foundations</strong>
              <p>Aug 2024 - Dec 2024 | University of Moratuwa, Sri Lanka</p>
              <p>Studying cloud computing fundamentals, including AWS services, architecture, and security.</p>
            </div>
            <div className={styles.course}>
              <strong>Cisco CyberOps Associate</strong>
              <p>Sep 2024 - Mar 2025 | University of Moratuwa, Sri Lanka</p>
              <p>Learning cybersecurity operations, threat analysis, and incident response techniques.</p>
            </div>
            <div className={styles.course}>
              <strong>Spring Boot 3, Spring 6 & Hibernate</strong>
              <p>Completed 2024 | Coursera</p>
            </div>
            <div className={styles.course}>
              <strong>IBM DevOps and Software Engineering</strong>
              <p>Completed 2023 | Coursera</p>
            </div>
            <div className={styles.course}>
              <strong>Google Cybersecurity Specialization</strong>
              <p>Completed 2024 | Coursera</p>
            </div>
            <div className={styles.course}>
              <strong>IoT Programming Specialization</strong>
              <p>Completed 2024 | Coursera</p>
            </div>
            <div className={styles.course}>
              <strong>IBM Machine Learning Specialization</strong>
              <p>Completed 2024 | Coursera</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Portfolio;