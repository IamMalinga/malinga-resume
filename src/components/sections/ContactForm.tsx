import React, { useEffect, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { type ContactFormData } from '../../types/contact';
import styles from '../../styles/components/ContactForm.module.css';
import Button from '../common/Button';
import { gsap } from 'gsap';
import { useTheme } from '../../hooks/useTheme'; // Assuming this hook exists

const ContactForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const formRef = useRef<HTMLFormElement>(null);
  const fieldsRef = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    // GSAP animations
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'back.out(1.7)' }
    );
    gsap.fromTo(
      fieldsRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out' }
    );
    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1, ease: 'elastic.out(1, 0.5)', delay: 0.6 }
    );
  }, []);

  const onSubmit: SubmitHandler<ContactFormData> = (data) => {
    console.log('Form submitted:', data);
    // TODO: Send form data to API
    reset();
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className={`${styles.form} ${theme === 'light' ? styles.light : ''}`}
    >
      <div ref={(el) => (fieldsRef.current[0] = el)} className={styles.field}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'Name is required' })}
          className={styles.input}
        />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>
      <div ref={(el) => (fieldsRef.current[1] = el)} className={styles.field}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Invalid email address',
            },
          })}
          className={styles.input}
        />
        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
      </div>
      <div ref={(el) => (fieldsRef.current[2] = el)} className={styles.field}>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          {...register('message', { required: 'Message is required' })}
          className={styles.textarea}
        />
        {errors.message && <span className={styles.error}>{errors.message.message}</span>}
      </div>
      <Button
        ref={buttonRef}
        type="submit"
        className={`${styles.submitButton} mt-4`}
      >
        Send Message
      </Button>
    </form>
  );
};

export default ContactForm;