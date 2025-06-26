import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/components/About.module.css';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';
import supabase from '../utils/supabase';
import PreloaderComponent from './PreloaderComponent';

const About: React.FC = () => {
  const bioRef = useRef<HTMLDivElement>(null);
  const credentialsRef = useRef<HTMLDivElement>(null);
  const profilePicRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  const [aboutData, setAboutData] = useState<{
    bio: string[];
    credentials: string[];
    profileImageUrl: string;
    cvUrl: string;
    socialLinks: { icon: string; url: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('about')
          .select('*')
          .limit(1); // Fetch only the first row
        if (fetchError) throw new Error(`Failed to fetch about data: ${fetchError.message}`);
        if (!data || data.length === 0) throw new Error('No about data found');

        const row = data[0];
        // Parse bio, credentials, and social_links as arrays if stored as JSON strings
        const bio = Array.isArray(row.bio) ? row.bio : (typeof row.bio === 'string' ? JSON.parse(row.bio) : []);
        const credentials = Array.isArray(row.credentials) ? row.credentials : (typeof row.credentials === 'string' ? JSON.parse(row.credentials) : []);
        const socialLinks = Array.isArray(row.social_links) ? row.social_links : (typeof row.social_links === 'string' ? JSON.parse(row.social_links) : []);

        setAboutData({
          bio,
          credentials,
          profileImageUrl: row.profile_image_url || '',
          cvUrl: row.cv_url || '',
          socialLinks,
        });
      } catch (err: any) {
        setError(`Failed to load about data: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (loading || error || !bioRef.current || !credentialsRef.current || !profilePicRef.current) return;

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
  }, [loading, error, theme]);

  useEffect(() => {
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
    if (aboutData?.cvUrl) {
      const link = document.createElement('a');
      link.href = aboutData.cvUrl;
      link.download = 'Malinga_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) return <PreloaderComponent />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <main className={`${styles.about} ${theme === 'light' ? styles.light : ''}`}>
      <canvas ref={canvasRef} className={styles.particleCanvas} />
      <div className={styles.contentWrapper}>
        <section ref={bioRef} className={styles.bio}>
          <h1 className={styles.sectionTitle}>About Me</h1>
          <div ref={profilePicRef} className={`${styles.profilePic} ${styles.imageSection}`}>
            {aboutData?.profileImageUrl ? (
              <img src={aboutData.profileImageUrl} alt="Profile Picture" className={styles.profileImage} />
            ) : (
              <div className={styles.placeholder}>No profile image</div>
            )}
            <div className={styles.glowRing}></div>
          </div>
          <div className={styles.bioContent}>
            <div className={styles.essay}>
              {aboutData?.bio.slice(0,1).map((paragraph, index) => (
                <p key={index} className={styles.sectionText}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className={styles.essayFull}>
            {aboutData?.bio.slice(1).map((paragraph, index) => (
              <p key={index} className={`${styles.sectionText} mt-6`}>
                {paragraph}
              </p>
            ))}
            <button className={styles.downloadButton} onClick={handleCvDownload} disabled={!aboutData?.cvUrl}>
              Download CV
            </button>
            <div className={styles.socialLinks}>
              {aboutData?.socialLinks.map((link, index) => (
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