import React, { forwardRef } from 'react';
import styles from '../../styles/components/Button.module.css'; // Adjust the path as needed

// Define the ButtonProps interface
interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | string; // Add variant prop
}

// Use forwardRef to allow ref forwarding
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ type = 'button', className = '', children, variant = 'primary' }, ref) => {
    // Optionally, you can use variant to apply different styles
    const variantClass = variant === 'primary' ? styles.primary : styles.secondary;

    return (
      <button
        ref={ref}
        type={type}
        className={`${styles.button} ${variantClass} ${className}`}
      >
        {children}
      </button>
    );
  }
);

// Optional: Set display name for better debugging
Button.displayName = 'Button';

export default Button;