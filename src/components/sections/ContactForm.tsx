import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/components/ContactForm.module.css';
import { gsap } from 'gsap';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.2 },
        { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }
      );
    }
  }, [isOpen]);

  const handleCloseModal = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => {
          onClose();
          modalRef.current!.style.display = 'none'; // Ensure modal is hidden after animation
        },
      });
    } else {
      onClose(); // Fallback if modalRef is not available
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmSend = async () => {
    setShowConfirm(false);
    setErrorMessage(null);

    const apiKey = import.meta.env.VITE_BREVO_KEY as string;
    if (!apiKey) {
      setErrorMessage('API key is missing. Please check your environment configuration.');
      console.error('API key is not set in environment variables. Ensure VITE_REACT_APP_SENDINBLUE_KEY is defined in your .env file.');
      return;
    }

    const url = 'https://api.brevo.com/v3/smtp/email';

    const emailData = {
      sender: {
        name: 'Malinga Samarakoon',
        email: 'malingasamarakoon401@gmail.com',
      },
      to: [{ email: 'malinga_samarakoon@outlook.com', name: formData.name }],
      subject: 'Contact Form Submission',
      htmlContent: `<html><body><h1>Contact Form Submission</h1><p><strong>Name:</strong> ${formData.name}</p><p><strong>Email:</strong> ${formData.email}</p><p><strong>Message:</strong> ${formData.message}</p></body></html>`,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send email: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Email sent successfully:', result);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        handleCloseModal();
      }, 3000);
    } catch (error) {
      console.error('Failed to send email:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred.');
      alert(errorMessage || 'Failed to send email. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.contactOverlay}>
        <div className={styles.contactModal} ref={modalRef}>
          <button
            className={styles.closeButton}
            onClick={handleCloseModal}
            onTouchStart={handleCloseModal} // Added touch event for mobile
            aria-label="Close contact form"
          >
            <i className="fas fa-times"></i>
          </button>
          <div className={styles.contactImage}>
            <div className={styles.iconWrapper}>
              <i className="fas fa-envelope-open-text"></i>
            </div>
          </div>
          <div className={styles.contactFormContainer}>
            <h2 className={styles.contactTitle}>Get in Touch</h2>
            <form className={styles.contactForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
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
                  value={formData.email}
                  onChange={handleChange}
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
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  className={styles.formTextarea}
                ></textarea>
              </div>
              <button
                type="submit"
                className={styles.submitButton}
              >
                Send Message
              </button>
              {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
            </form>
          </div>
        </div>
      </div>
      {showConfirm && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmDialog}>
            <p className={styles.confirmMessage}>Are you sure you want to send this message?</p>
            <div className={styles.buttonGroup}>
              <button
                className={styles.confirmButton}
                onClick={confirmSend}
              >
                Yes
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowConfirm(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccess && <div className={styles.successPopup}>Email sent successfully!</div>}
    </>
  );
};

export default ContactForm;