import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MaterialIcon } from './Icons';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'error' | 'warning' | 'primary';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'হ্যাঁ, নিশ্চিত করুন',
  cancelLabel = 'না, ফিরে যান',
  onConfirm,
  onCancel,
  variant = 'error'
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'error': return 'bg-error text-on-error hover:bg-error/90';
      case 'warning': return 'bg-warning text-on-warning hover:bg-warning/90';
      default: return 'bg-primary text-on-primary hover:bg-primary/90';
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'error': return <MaterialIcon name="delete_forever" size={32} className="text-error" />;
      case 'warning': return <MaterialIcon name="warning" size={32} className="text-warning" />;
      default: return <MaterialIcon name="info" size={32} className="text-primary" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-surface-container-lowest w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl border border-outline-variant"
        >
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center border border-outline-variant">
                {getIcon()}
              </div>
              <h3 className="text-xl font-black text-on-surface tracking-tight leading-tight">
                {title}
              </h3>
            </div>
            
            <p className="text-on-surface-variant font-medium text-[16px] leading-relaxed mb-8">
              {message}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onCancel}
                className="flex-1 h-12 px-6 rounded-2xl bg-surface-container-high text-on-surface-variant font-bold text-sm hover:bg-surface-container-highest transition-all border border-outline-variant"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 h-12 px-6 rounded-2xl font-bold text-sm transition-all shadow-sm active:scale-[0.98] ${getVariantStyles()}`}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
