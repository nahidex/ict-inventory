import { motion } from 'motion/react';
import { MaterialIcon } from '../atoms/Icons';

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  description: string;
  variant?: 'primary' | 'secondary' | 'error' | 'tertiary';
  delay?: number;
}

export default function StatCard({ icon, label, value, description, variant = 'primary', delay = 0 }: StatCardProps) {
  const borderColors = {
    primary: 'border-t-primary',
    secondary: 'border-t-secondary',
    error: 'border-t-error',
    tertiary: 'border-t-tertiary',
  };

  const iconBgColors = {
    primary: 'bg-primary-container text-on-primary-container',
    secondary: 'bg-secondary-container text-on-secondary-container',
    error: 'bg-error-container text-on-error-container',
    tertiary: 'bg-tertiary-container text-on-tertiary-container',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className={`bg-surface-container-lowest p-6 rounded-2xl m3-elevation-1 hover:m3-elevation-2 transition-all flex flex-col justify-between border-t-4 ${borderColors[variant]}`}
    >
      <div className="flex justify-between items-start">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgColors[variant]}`}>
          <MaterialIcon name={icon} size={24} fill />
        </div>
        <span className="text-xs font-bold text-on-surface-variant tracking-wider uppercase bg-surface-container-high px-2 py-1 rounded-md">
          {label}
        </span>
      </div>
      <div className="mt-6">
        <h3 className="text-4xl font-extrabold text-on-surface tracking-tight font-sans">{value}</h3>
        <p className="text-sm text-on-surface-variant mt-1">{description}</p>
      </div>
    </motion.div>
  );
}
