import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/components/Portfolio.module.css';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';
import supabase from '../utils/supabase';
import { type Basics, type Work, type Education, type Project, type Skill, type Course } from '../types/portfolio';
import PreloaderComponent from './PreloaderComponent';

// Define types for parsed responsibilities and descriptions
interface Responsibility {
  text: string;
}

interface ProjectDescription {
  text: string;
}

const Portfolio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const basicsRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const workRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const educationRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const projectsRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const skillsRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const coursesRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const { theme } = useTheme();
  const sectionRefs = [basicsRef, workRef, educationRef, projectsRef, skillsRef, coursesRef];
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const [basics, setBasics] = useState<Basics | null>(null);
  const [work, setWork] = useState<Work[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState({
    basics: false,
    work: false,
    education: false,
    projects: false,
    skills: false,
    courses: false,
  });
  const [skillFilter, setSkillFilter] = useState<string>('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch Basics
        const { data: basicsData, error: basicsError } = await supabase
          .from('basics')
          .select('*')
          .maybeSingle();
        if (basicsError) throw new Error(`Basics fetch error: ${basicsError.message}`);
        setBasics(basicsData);

        // Fetch Work
        const { data: workData, error: workError } = await supabase
          .from('work')
          .select('*')
          .order('start_date', { ascending: false });
        if (workError) throw new Error(`Work fetch error: ${workError.message}`);
        const parsedWork = workData?.map((job: Work) => {
          try {
            const responsibilities = job.responsibilities?.map((item: any) => {
              if (typeof item === 'string') {
                const parsed = JSON.parse(item);
                if (typeof parsed === 'object' && parsed !== null && 'text' in parsed) {
                  return parsed as Responsibility;
                }
                throw new Error('Invalid responsibility format');
              } else if (typeof item === 'object' && item !== null && 'text' in item) {
                return item as Responsibility;
              }
              throw new Error('Invalid responsibility format');
            }) || [];
            return { ...job, responsibilities };
          } catch (parseError) {
            console.error(`Failed to parse responsibilities for job ${job.id}:`, parseError);
            return { ...job, responsibilities: [] };
          }
        }) || [];
        setWork(parsedWork);

        // Fetch Education
        const { data: educationData, error: educationError } = await supabase
          .from('education')
          .select('*')
          .order('start_date', { ascending: false });
        if (educationError) throw new Error(`Education fetch error: ${educationError.message}`);
        setEducation(educationData || []);

        // Fetch Projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('start_date', { ascending: false });
        if (projectsError) throw new Error(`Projects fetch error: ${projectsError.message}`);
        const parsedProjects = projectsData?.map((project: Project) => {
          try {
            // Ensure description is an array of strings before parsing
            const descriptionArray: string[] =
              Array.isArray(project.description) && typeof project.description[0] === 'string'
                ? project.description as unknown as string[]
                : [];
            const description = descriptionArray.map((item: string) => {
              const parsed = JSON.parse(item);
              if (typeof parsed === 'object' && parsed !== null && 'text' in parsed) {
                return parsed as ProjectDescription;
              }
              throw new Error('Invalid description format');
            }) || [];
            return { ...project, description };
          } catch (parseError) {
            console.error(`Failed to parse description for project ${project.id}:`, parseError);
            return { ...project, description: [] };
          }
        }) || [];
        setProjects(parsedProjects);

        // Fetch Skills
        const { data: skillsData, error: skillsError } = await supabase
          .from('skills')
          .select('*');
        if (skillsError) throw new Error(`Skills fetch error: ${skillsError.message}`);
        setSkills(skillsData || []);

        // Fetch Courses
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .order('start_date', { ascending: false });
        if (coursesError) throw new Error(`Courses fetch error: ${coursesError.message}`);
        setCourses(coursesData || []);

      } catch (err: any) {
        setError(`Failed to fetch data: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (loading || error) return;

    const animateSection = (ref: React.RefObject<HTMLDivElement>, delay: number) => {
      if (ref.current) {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay }
        );
      }
    };

    animateSection(basicsRef, 0);
    animateSection(workRef, 0.2);
    animateSection(educationRef, 0.4);
    animateSection(projectsRef, 0.6);
    animateSection(skillsRef, 0.8);
    animateSection(coursesRef, 1.0);
  }, [loading, error]);

  useEffect(() => {
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
      { threshold: 0.5 }
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

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => {
      const newState = { ...prev, [section]: !prev[section] };
      const refMap: { [key: string]: React.RefObject<HTMLDivElement> } = {
        basics: basicsRef,
        work: workRef,
        education: educationRef,
        projects: projectsRef,
        skills: skillsRef,
        courses: coursesRef,
      };
      const ref = refMap[section];
      if (ref.current) {
        if (newState[section]) {
          gsap.to(ref.current.querySelector(`.${styles.details}`), {
            height: 0,
            opacity: 0,
            duration: 0.5,
            ease: 'power3.inOut',
          });
        } else {
          gsap.to(ref.current.querySelector(`.${styles.details}`), {
            height: 'auto',
            opacity: 1,
            duration: 0.5,
            ease: 'power3.inOut',
          });
        }
      }
      return newState;
    });
  };

  const skillCategories = ['All', ...new Set(skills.map(skill => skill.category))];
  const filteredSkills = skillFilter === 'All' ? skills : skills.filter(skill => skill.category === skillFilter);

  if (loading) {
    return <PreloaderComponent />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <main className={styles.portfolio} data-theme={theme}>
      <canvas ref={canvasRef} className={styles.particleCanvas} />
      <nav className={styles.navBar}>
        <ul className={styles.navList}>
          {['Basics', 'Work', 'Education', 'Projects', 'Skills', 'Courses'].map((section, index) => (
            <li key={section}>
              <a
                href={`#${section.toLowerCase()}`}
                ref={el => { navItemsRef.current[index] = el; }}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(sectionRefs[index]);
                }}
              >
                {section}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.resume}>
        {/* Basics Section */}
        <div ref={basicsRef} id="basics" className={styles.card}>
          <h2 className={styles.sectionTitle} onClick={() => toggleSection('basics')}>
            Basics {collapsedSections.basics ? '▼' : '▲'}
          </h2>
          <div className={styles.details}>
            {basics ? (
              <>
                <p><strong>Name:</strong> {basics.name}</p>
                <p><strong>Label:</strong> {basics.label}</p>
                <p><strong>Email:</strong> <a href={`mailto:${basics.email}`}>{basics.email}</a></p>
                <p><strong>URL:</strong> <a href={basics.url} target="_blank" rel="noopener noreferrer">{basics.url}</a></p>
                {basics.social_links && (
                  <div className={styles.socialLinks}>
                    {basics.social_links.linkedin && (
                      <a href={basics.social_links.linkedin} target="_blank" rel="noopener noreferrer">
                        LinkedIn
                      </a>
                    )}
                    {basics.social_links.github && (
                      <a href={basics.social_links.github} target="_blank" rel="noopener noreferrer">
                        GitHub
                      </a>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p>No basics information available.</p>
            )}
          </div>
        </div>

        {/* Work Section */}
        <div ref={workRef} id="work" className={styles.card}>
          <h2 className={styles.sectionTitle} onClick={() => toggleSection('work')}>
            Work {collapsedSections.work ? '▼' : '▲'}
          </h2>
          <div className={styles.details}>
            {work.length > 0 ? (
              work.map((job: Work) => (
                <div key={job.id} className={styles.job}>
                  <span className={styles.date}>
                    {job.start_date ? new Date(job.start_date).getFullYear() : ''} -{' '}
                    {job.end_date ? new Date(job.end_date).getFullYear() : 'Present'}
                  </span>
                  <strong>{job.title} {job.company ? `| ${job.company}` : ''}</strong> {job.location ? `| ${job.location}` : ''}
                  {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 ? (
                    <ul className={styles.jobList}>
                      {job.responsibilities.map((task: Responsibility, index: number) => (
                        <li key={index}>{task.text || `Responsibility ${index + 1} unavailable`}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No responsibilities listed.</p>
                  )}
                </div>
              ))
            ) : (
              <p>No work experience available.</p>
            )}
          </div>
        </div>

        {/* Education Section */}
        <div ref={educationRef} id="education" className={styles.card}>
          <h2 className={styles.sectionTitle} onClick={() => toggleSection('education')}>
            Education {collapsedSections.education ? '▼' : '▲'}
          </h2>
          <div className={styles.details}>
            {education.length > 0 ? (
              education.map((edu: Education) => (
                <div key={edu.id} className={styles.educationItem}>
                  <strong>{edu.institution} | {edu.degree}</strong>
                  <p>
                    {edu.start_date ? new Date(edu.start_date).getFullYear() : ''} -{' '}
                    {edu.end_date ? new Date(edu.end_date).getFullYear() : 'In Progress'} {edu.location ? `| ${edu.location}` : ''}
                  </p>
                  {edu.description && <p>{edu.description}</p>}
                </div>
              ))
            ) : (
              <p>No education information available.</p>
            )}
          </div>
        </div>

        {/* Projects Section */}
        <div ref={projectsRef} id="projects" className={styles.card}>
          <h2 className={styles.sectionTitle} onClick={() => toggleSection('projects')}>
            Projects {collapsedSections.projects ? '▼' : '▲'}
          </h2>
          <div className={styles.details}>
            {projects.length > 0 ? (
              projects.map((project: Project) => (
                <div key={project.id} className={styles.job}>
                  <span className={styles.date}>
                    {project.start_date ? `${new Date(project.start_date).toLocaleString('default', { month: 'short' })} ${new Date(project.start_date).getFullYear()}` : ''} -{' '}
                    {project.end_date ? `${new Date(project.end_date).toLocaleString('default', { month: 'short' })} ${new Date(project.end_date).getFullYear()}` : 'Present'}
                  </span>
                  {project.url ? (
                    <strong>
                      <a href={project.url} target="_blank" rel="noopener noreferrer">{project.title}</a>
                    </strong>
                  ) : (
                    <strong>{project.title}</strong>
                  )}
                  {project.location ? ` | ${project.location}` : ''}
                  {Array.isArray(project.description) && project.description.length > 0 ? (
                    <ul className={styles.jobList}>
                      {project.description.map((task: ProjectDescription, index: number) => (
                        <li key={index}>{task.text || `Description ${index + 1} unavailable`}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No project description available.</p>
                  )}
                </div>
              ))
            ) : (
              <p>No projects available.</p>
            )}
          </div>
        </div>

        {/* Skills Section */}
        <div ref={skillsRef} id="skills" className={styles.card}>
          <h2 className={styles.sectionTitle} onClick={() => toggleSection('skills')}>
            Skills {collapsedSections.skills ? '▼' : '▲'}
          </h2>
          <div className={styles.details}>
            {skills.length > 0 ? (
              <>
                <div className={styles.skillFilter}>
                  <label>Filter by Category: </label>
                  <select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
                    {skillCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                {filteredSkills.map((skill: Skill) => (
                  <div key={skill.id} className={styles.skillCategory}>
                    <strong>{skill.category}:</strong> {skill.items.join(', ')}
                  </div>
                ))}
              </>
            ) : (
              <p>No skills available.</p>
            )}
          </div>
        </div>

        {/* Courses and Certifications Section */}
        <div ref={coursesRef} id="courses" className={styles.card}>
          <h2 className={styles.sectionTitle} onClick={() => toggleSection('courses')}>
            Courses and Certifications {collapsedSections.courses ? '▼' : '▲'}
          </h2>
          <div className={styles.details}>
            {courses.length > 0 ? (
              courses.map((course: Course) => (
                <div key={course.id} className={styles.course}>
                  <strong>{course.title}</strong>
                  <p>
                    {course.start_date && course.end_date
                      ? `${new Date(course.start_date).toLocaleString('default', { month: 'short' })} ${new Date(course.start_date).getFullYear()} - ${new Date(course.end_date).toLocaleString('default', { month: 'short' })} ${new Date(course.end_date).getFullYear()}`
                      : 'Completed ' + (course.start_date ? new Date(course.start_date).getFullYear() : '')} | {course.institution}
                  </p>
                  {course.description && <p>{course.description}</p>}
                  {course.certificate_url && (
                    <a href={course.certificate_url} target="_blank" rel="noopener noreferrer" className={styles.certificateLink}>
                      View Certificate
                    </a>
                  )}
                </div>
              ))
            ) : (
              <p>No courses available.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Portfolio;