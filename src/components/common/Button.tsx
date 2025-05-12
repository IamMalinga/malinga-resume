import React from 'react';
import styles from '../../styles/components/Button.module.css';
import classNames from 'classnames';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  type = 'button',
  disabled = false,
  children,
  onClick,
  className,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classNames(styles.button, styles[variant], className)}
    >
      {children}
    </button>
  );
};

export default Button;