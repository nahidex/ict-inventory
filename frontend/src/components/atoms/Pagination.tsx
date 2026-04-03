import { motion } from 'motion/react';
import { MaterialIcon } from './Icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  label?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  label = 'সম্পদ'
}: PaginationProps) {
  if (totalPages <= 1) {
    return (
      <div className="px-8 py-5 border-t border-outline-variant/30 flex items-center justify-between bg-surface-container-low/50">
        <div className="text-[13px] font-bold text-on-surface-variant flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary/40" />
          মোট {totalItems}টি {label}
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-4 border-t border-outline-variant/30 flex items-center justify-between bg-surface-container-low/50">
      <div className="flex items-center gap-3">
        <div className="text-[13px] font-bold text-on-surface-variant flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          মোট {totalItems}টি {label}
        </div>
        <div className="h-4 w-[1px] bg-outline-variant/50 mx-2" />
        <div className="text-[12px] font-black text-primary/60 uppercase tracking-widest leading-none bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
          পৃষ্ঠা {currentPage} / {totalPages}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`h-10 px-4 flex items-center gap-2 rounded-xl text-[13px] font-bold transition-all border ${
            currentPage === 1 
              ? 'bg-surface-container-high text-on-surface-variant/30 border-outline-variant/30 cursor-not-allowed' 
              : 'bg-white text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/40 shadow-sm'
          }`}
        >
          <MaterialIcon name="chevron_left" size={20} />
          <span>পূর্ববর্তী</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`h-10 px-4 flex items-center gap-2 rounded-xl text-[13px] font-bold transition-all border ${
            currentPage === totalPages 
              ? 'bg-surface-container-high text-on-surface-variant/30 border-outline-variant/30 cursor-not-allowed' 
              : 'bg-white text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/40 shadow-sm'
          }`}
        >
          <span>পরবর্তী</span>
          <MaterialIcon name="chevron_right" size={20} />
        </motion.button>
      </div>
    </div>
  );
}
