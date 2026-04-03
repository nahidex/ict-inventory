import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MaterialIcon } from '../atoms/Icons';

interface ToastProps {
  isOpen: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  isOpen,
  message,
  type = 'success',
  onClose
}) => {
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const styles = {
    success: {
      bg: 'bg-primary-container',
      text: 'text-on-primary-container',
      icon: 'check_circle'
    },
    error: {
      bg: 'bg-error-container',
      text: 'text-on-error-container',
      icon: 'error'
    },
    info: {
      bg: 'bg-secondary-container',
      text: 'text-on-secondary-container',
      icon: 'info'
    }
  };

  const style = styles[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999]"
        >
          <div className={`${style.bg} ${style.text} px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl border border-outline-variant min-w-[300px] max-w-sm`}>
            <MaterialIcon name={style.icon} size={20} />
            <span className="text-sm font-bold flex-1">{message}</span>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10"
            >
              <MaterialIcon name="close" size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
