import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/components/Hero.module.css';
import Button from '../common/Button';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TopProjects from './TopProjects';
import ContactForm from './ContactForm';
import SkillsSection from './SkillsSection';
import supabase from '../../utils/supabase';
import PreloaderComponent from '../../pages/PreloaderComponent';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const professionRef = useRef<HTMLParagraphElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contactButtonRef = useRef<HTMLButtonElement>(null);
  const socialLinksRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [heroData, setHeroData] = useState<{
    name: string;
    profession: string;
    subtitle: string;
    profileImageUrl: string;
    cvUrl: string;
    socialLinks: { name: string; icon: string; url: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDataAndSetupAnimation = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('hero')
          .select('*')
          .limit(1);
        if (fetchError) throw new Error(`Failed to fetch hero data: ${fetchError.message}`);
        if (!data || data.length === 0) throw new Error('No hero data found');

        const row = data[0];
        const socialLinks = Array.isArray(row.social_links) ? row.social_links : (typeof row.social_links === 'string' ? JSON.parse(row.social_links) : []);

        setHeroData({
          name: row.name || 'Malinga Samarakoon',
          profession: row.profession || 'Aspiring Software Developer | DevOps Enthusiast',
          subtitle: row.subtitle || '',
          profileImageUrl: row.profile_image_url || '',
          cvUrl: row.cv_url || '',
          socialLinks,
        });

        // Initialize GSAP animation only after data is successfully fetched
        if (
          !loading &&
          !error &&
          nameRef.current &&
          professionRef.current &&
          subtitleRef.current &&
          buttonRef.current &&
          contactButtonRef.current &&
          socialLinksRef.current
        ) {
          const tl = gsap.timeline();

          tl.fromTo(
            nameRef.current,
            { opacity: 0, y: 20, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }
          )
            .fromTo(
              professionRef.current,
              { opacity: 0, y: 20, scale: 0.9 },
              { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' },
              '-=0.8'
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
        }
      } catch (err: any) {
        setError(`Failed to load hero data: ${err.message}`);
        console.error('Fetch error details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndSetupAnimation();
  }, []); // Empty dependency array to run once on mount

  const handleCvDownload = () => {
    if (heroData?.cvUrl) {
      const link = document.createElement('a');
      link.href = heroData.cvUrl;
      link.download = 'Malinga_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleContactClick = () => {
    setIsModalOpen(true);
  };

  if (loading) return <PreloaderComponent />;
  if (error) return <div className={styles.error}>{error} <button onClick={() => window.location.reload()}>Retry</button></div>;

  return (
    <section className={styles.hero} ref={heroRef} aria-label="Hero Section with Profile Introduction">
      <div className={styles.heroContainer}>
        <div className={styles.textContent}>
          <h1
            ref={nameRef}
            className={`${styles.name} text-4xl md:text-6xl font-bold mb-2`}
          >
            {heroData?.name}
          </h1>
          <p
            ref={professionRef}
            className={`${styles.profession} text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6`}
          >
            {heroData?.profession}
          </p>
          <p
            ref={subtitleRef}
            className={`${styles.subtitle} text-lg md:text-xl max-w-2xl mb-8`}
            dangerouslySetInnerHTML={{ __html: heroData?.subtitle || '' }}
          />
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
        <div className={styles.profileSection}>
          <div className={styles.imageContent}>
            <div className={styles.profileImageContainer}>
              <img
                src={heroData?.profileImageUrl || ''}
                alt="Profile"
                className={styles.profileImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/300'; // Fallback image
                }}
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
                {heroData?.socialLinks.map((link, index) => (
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