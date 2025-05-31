import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { type BlogPost } from '../types/blog.ts';
import { formatDate } from '../utils/formatDate.ts';
import styles from '../styles/components/Blog.module.css';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';
import supabase from '../utils/supabase';
import PreloaderComponent from './PreloaderComponent.tsx';

const POSTS_PER_PAGE = 6;

const Blog: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const postsRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('posts')
          .select('id, title, excerpt, date, content, banner_url, category')
          .order('date', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        setPosts((data as BlogPost[]) || []);
        setFilteredPosts((data as BlogPost[]) || []);
        setCategories([
          ...new Set(
            ((data as BlogPost[]) || []).map((post: BlogPost) => post.category)
          ),
        ]);
      } catch (err) {
        setError('Failed to fetch posts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    // Filter posts by search query and category
    let filtered = posts;
    if (searchQuery) {
      filtered = filtered.filter(
        post =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchQuery, selectedCategory, posts]);

  useEffect(() => {
    // GSAP animations
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
    if (postsRef.current?.children) {
      const childrenArray = Array.from(postsRef.current.children);
      gsap.fromTo(
        childrenArray,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.2, ease: 'back.out(1.7)' }
      );
    }

    // Three.js particle background
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category);
  };

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  if (loading) {
    return <PreloaderComponent />;;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <main className={`${styles.blog} ${theme === 'light' ? styles.light : ''}`}>
      <canvas ref={canvasRef} className={styles.particleCanvas} />
      <h1 ref={titleRef} className={styles.title}>Blog</h1>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={handleSearch}
          className={styles.searchBar}
          aria-label="Search blog posts"
        />
        <div className={styles.categories}>
          <button
            className={`${styles.categoryButton} ${selectedCategory === null ? styles.active : ''}`}
            onClick={() => handleCategoryClick(null)}
            aria-label="Show all categories"
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => handleCategoryClick(category)}
              aria-label={`Filter by ${category}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
<div ref={postsRef} className={styles.posts}>
  {paginatedPosts.map(post => (
    <article key={post.id} className={styles.post}>
      {post.banner_url && (
        <div className={styles.bannerContainer}>
          <img
            src={post.banner_url}
            alt={`${post.title} banner`}
            className={styles.bannerImage}
          />
          <div className={styles.bannerOverlay}></div>
        </div>
      )}
      <div className={styles.postContent}>
        <h2 className={styles.postTitle}>{post.title}</h2>
        <div className={styles.meta}>
          <p className={styles.date}>{formatDate(post.date)}</p>
          <span className={styles.categoryBadge}>{post.category}</span>
        </div>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <Link to={`/blog/${post.id}`} className={styles.readMore}>
          <span>Read More</span>
          <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
    </article>
  ))}
</div>
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`${styles.pageButton} ${currentPage === i + 1 ? styles.active : ''}`}
            onClick={() => setCurrentPage(i + 1)}
            aria-label={`Go to page ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </main>
  );
};

export default Blog;