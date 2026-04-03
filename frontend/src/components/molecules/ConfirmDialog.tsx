import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MaterialIcon } from '../atoms/Icons';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'primary' | 'warning';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'নিশ্চিত করুন',
  cancelLabel = 'বাতিল',
  onConfirm,
  onCancel,
  variant = 'primary'
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: 'delete_forever',
      iconBg: 'bg-error-container text-on-error-container',
      btnBg: 'bg-error text-on-error hover:bg-error/90 shadow-error/20',
    },
    primary: {
      icon: 'info',
      iconBg: 'bg-primary-container text-on-primary-container',
      btnBg: 'bg-primary text-on-primary hover:bg-primary/90 shadow-primary/20',
    },
    warning: {
      icon: 'warning',
      iconBg: 'bg-warning-container text-on-warning-container',
      btnBg: 'bg-warning text-on-warning hover:bg-warning/90 shadow-warning/20',
    }
  };

  const style = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Dialog Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-surface-container-lowest rounded-[28px] shadow-2xl overflow-hidden border border-outline-variant"
          >
            <div className="p-6 md:p-8">
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 ${style.iconBg} rounded-2xl flex items-center justify-center mb-4`}>
                  <MaterialIcon name={style.icon} size={28} />
                </div>
                
                <h3 className="text-xl font-bold text-on-surface mb-2">
                  {title}
                </h3>
                
                <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
                  {message}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    onClick={onCancel}
                    className="flex-1 px-6 py-3 rounded-full font-bold text-sm text-on-surface hover:bg-surface-container-high transition-colors border border-outline-variant"
                  >
                    {cancelLabel}
                  </button>
                  <button
                    onClick={onConfirm}
                    className={`flex-1 px-6 py-3 rounded-full font-bold text-sm ${style.btnBg} transition-all shadow-lg active:scale-95`}
                  >
                    {confirmLabel}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
