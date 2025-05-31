import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { type BlogPost, type Comment } from '../types/blog.ts';
import { formatDate } from '../utils/formatDate.ts';
import styles from '../styles/components/Blog.module.css';
import supabase from '../utils/supabase';
import { useTheme } from '../hooks/useTheme';
import { gsap } from 'gsap';
import PreloaderComponent from './PreloaderComponent.tsx';

const BlogView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isTocOpen, setIsTocOpen] = useState(true);
  const [progress, setProgress] = useState(0);
  const { theme } = useTheme();
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement }>({});
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const initializeUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || `user_${Math.random().toString(36).slice(2, 11)}`);
    };
    initializeUser();
  }, []);

  useEffect(() => {
    const fetchPostAndData = async () => {
      if (!userId) return;

      try {
        setLoading(true);

        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('id, title, excerpt, date, content, banner_url, category')
          .eq('id', id)
          .single();

        if (postError) throw new Error(`Post fetch error: ${postError.message}`);

        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', id)
          .order('created_at', { ascending: false });

        if (commentsError) throw new Error(`Comments fetch error: ${commentsError.message}`);

        const { count: likeCountData, error: likeError } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', id);

        if (likeError) throw new Error(`Like count error: ${likeError.message}`);

        const { data: userLike, error: userLikeError } = await supabase
          .from('likes')
          .select('id')
          .eq('post_id', id)
          .eq('user_id', userId)
          .single();

        if (userLikeError && userLikeError.code !== 'PGRST116') {
          console.error(`User like error: ${userLikeError.message}`);
        }

        setPost(postData);
        setComments(commentsData || []);
        setLikeCount(likeCountData || 0);
        setHasLiked(!!userLike);
      } catch (err: any) {
        setError(`Failed to fetch data: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndData();
  }, [id, userId]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -100px 0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionTitle = Object.keys(sectionRefs.current).find(
            (title) => sectionRefs.current[title] === entry.target
          );
          if (sectionTitle) {
            setActiveSection(sectionTitle);
          }
        }
      });
    }, observerOptions);

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [post]);

  useEffect(() => {
    const handleScroll = () => {
      const content = document.querySelector(`.${styles.content}`);
      if (content) {
        const contentHeight = content.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min((window.scrollY / contentHeight) * 100, 100);
        setProgress(scrollPercent);
      }
    };

    console.log('Scroll progress:', progress);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);

  const scrollToSection = (title: string) => {
    const section = sectionRefs.current[title];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(title);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert([{ post_id: id, user_id: userId, content: newComment }]);

      if (error) throw error;

      const newCommentObj: Comment = {
        id: Date.now(),
        post_id: id!,
        user_id: userId,
        content: newComment,
        created_at: new Date().toISOString(),
      };

      setComments([newCommentObj, ...comments]);
      setNewComment('');

      gsap.fromTo(
        commentInputRef.current,
        { scale: 1.05, background: 'rgba(255, 255, 255, 0.2)' },
        { scale: 1, background: 'transparent', duration: 0.3 }
      );
    } catch (err: any) {
      console.error('Error posting comment:', err.message);
    }
  };

  const handleLike = async () => {
    if (hasLiked) return;

    try {
      const { error } = await supabase
        .from('likes')
        .insert([{ post_id: id, user_id: userId }]);

      if (error) throw error;

      setLikeCount(prev => prev + 1);
      setHasLiked(true);

      gsap.to(`.${styles.likeButton}`, {
        scale: 1.2,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
      });
    } catch (err: any) {
      console.error('Error liking post:', err.message);
    }
  };

  const sharePost = (platform: 'twitter' | 'linkedin') => {
    const url = window.location.href;
    const text = encodeURIComponent(post?.title || 'Check out this blog post!');
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    }
  };

  if (loading) {
    return <PreloaderComponent />;
  }

  if (error || !post) {
    return <div className={styles.error}>{error || 'Post not found.'}</div>;
  }

  const subsections = Array.isArray(post.content) ? post.content : [];

  return (
    <main className={`${styles.blog} ${theme === 'light' ? styles.light : ''}`}>
      <div className={styles.postViewContainer}>
        <nav className={`${styles.navMenu} ${isTocOpen ? styles.open : ''}`}>
          <button
            className={styles.tocToggle}
            onClick={() => setIsTocOpen(!isTocOpen)}
            aria-label={isTocOpen ? 'Collapse Table of Contents' : 'Expand Table of Contents'}
          >
            <i className={`fas ${isTocOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
            {isTocOpen && <span>Table of Contents</span>}
          </button>
          <ul>
            {subsections.map((section, index) => (
              <li key={index}>
                <button
                  className={`${styles.navItem} ${activeSection === section.title ? styles.active : ''}`}
                  onClick={() => scrollToSection(section.title)}
                  aria-label={`Navigate to ${section.title}`}
                >
                  <i className="fas fa-circle" style={{ fontSize: '0.5rem', marginRight: isTocOpen ? '0.5rem' : '0' }}></i>
                  {isTocOpen && <span>{section.title}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <article className={styles.postView}>
          {post.banner_url && (
            <img
              src={post.banner_url}
              alt={`${post.title} banner`}
              className={styles.bannerImage}
              onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/800x350?text=Banner+Not+Found'; }}
            />
          )}
          <div className={styles.content}>
          <h1 className={styles.postTitle}>{post.title}</h1>
          <div className={styles.meta}>
            <p className={styles.date}>{formatDate(post.date)}</p>
            <span className={styles.categoryBadge}>{post.category}</span>
          </div>
          <div className={styles.content}>
            {subsections.map((section, index) => (
              <div
                key={index}
                ref={el => {
                  if (el) sectionRefs.current[section.title] = el;
                }}
                className={styles.subsection}
              >
                <h2 className={styles.subsectionTitle}>{section.title}</h2>
                <p className={styles.subsectionBody}>{section.content}</p>
                {section.image_url && (
                  <figure className={styles.contentImage}>
                    <img
                      src={section.image_url}
                      alt={section.image_caption || `${section.title} image`}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found'; }}
                    />
                    {section.image_caption && (
                      <figcaption>{section.image_caption}</figcaption>
                    )}
                  </figure>
                )}
              </div>
            ))}
          </div>
          <div className={styles.engagement}>
            <button
              className={`${styles.likeButton} ${hasLiked ? styles.liked : ''}`}
              onClick={handleLike}
              disabled={hasLiked}
              aria-label={hasLiked ? 'Post liked' : 'Like post'}
            >
              <i className={`fas fa-heart ${hasLiked ? styles.likedIcon : ''}`}></i>
              {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
            </button>
            <div className={styles.shareButtons}>
              <button
                className={styles.shareButton}
                onClick={() => sharePost('twitter')}
                aria-label="Share on Twitter"
              >
                <i className="fab fa-twitter"></i> Twitter
              </button>
              <button
                className={styles.shareButton}
                onClick={() => sharePost('linkedin')}
                aria-label="Share on LinkedIn"
              >
                <i className="fab fa-linkedin"></i> LinkedIn
              </button>
            </div>
          </div>
          <div className={styles.commentsSection}>
            <h3 className={styles.commentsTitle}>Comments ({comments.length})</h3>
            <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
              <textarea
                ref={commentInputRef}
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className={styles.commentInput}
                aria-label="Comment input"
              />
              <button type="submit" className={styles.commentSubmit}>
                Post Comment
              </button>
            </form>
            <div className={styles.commentsList}>
              {comments.map(comment => (
                <div key={comment.id} className={styles.comment}>
                  <p className={styles.commentUser}>User {comment.user_id.slice(5, 9)}</p>
                  <p className={styles.commentContent}>{comment.content}</p>
                  <p className={styles.commentDate}>
                    {formatDate(comment.created_at)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <Link to="/blog" className={styles.backButton}>
            Back to Blog
          </Link>
          </div>
        </article>
      </div>
    </main>
  );
};

export default BlogView;