import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'neutral' | 'primary' | 'secondary';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  showDot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { bg: string; dot: string; ring: string }> = {
  success: {
    bg: 'bg-green-100 text-green-800',
    dot: 'bg-green-600',
    ring: 'ring-green-600/20',
  },
  warning: {
    bg: 'bg-yellow-100 text-yellow-800',
    dot: 'bg-yellow-600',
    ring: 'ring-yellow-600/20',
  },
  error: {
    bg: 'bg-error-container text-on-error-container',
    dot: 'bg-error',
    ring: 'ring-error/20',
  },
  neutral: {
    bg: 'bg-surface-variant text-on-surface-variant',
    dot: 'bg-outline',
    ring: 'ring-outline-variant',
  },
  primary: {
    bg: 'bg-primary-container text-on-primary-container',
    dot: 'bg-primary',
    ring: 'ring-primary/20',
  },
  secondary: {
    bg: 'bg-secondary-container text-on-secondary-container',
    dot: 'bg-secondary',
    ring: 'ring-secondary/20',
  },
};

export const Badge: React.FC<BadgeProps> = ({ 
  label, 
  variant = 'neutral', 
  showDot = true,
  className = ''
}) => {
  const styles = variantStyles[variant];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-black ring-1 ring-inset font-sans ${styles.bg} ${styles.ring} ${className}`}>
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}></span>
      )}
      {label}
    </span>
  );
};
