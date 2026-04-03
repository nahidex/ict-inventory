import React from 'react';
import { MaterialIcon } from './Icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  label?: string; // e.g., "অফিসার", "এসেট"
}

// Helper to convert numbers to Bengali
const toBengaliNumber = (num: number | string) => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (digit) => bengaliDigits[parseInt(digit)]);
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  label = 'আইটেম'
}) => {
  if (totalPages <= 1) return null;

  const startRange = (currentPage - 1) * itemsPerPage + 1;
  const endRange = Math.min(currentPage * itemsPerPage, totalItems);

  const renderPageButtons = () => {
    const buttons = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || 
            i === totalPages || 
            (i >= currentPage - delta && i <= currentPage + delta)
        ) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm transition-all ${
                        currentPage === i 
                            ? 'bg-primary text-on-primary shadow-sm' 
                            : 'hover:bg-surface-container-high text-on-surface-variant'
                    }`}
                >
                    {toBengaliNumber(i)}
                </button>
            );
        } else if (
            i === currentPage - delta - 1 || 
            i === currentPage + delta + 1
        ) {
            buttons.push(<span key={i} className="px-2 text-on-surface-variant">...</span>);
        }
    }
    return buttons;
  };

  return (
    <div className="px-8 py-4 flex items-center justify-between border-t border-outline-variant bg-surface-container-lowest">
      <div className="text-sm text-on-surface-variant">
        মোট <span className="font-bold text-on-surface">{toBengaliNumber(totalItems)}</span> টি {label}ের মধ্যে <span className="font-bold text-on-surface">{toBengaliNumber(startRange)}-{toBengaliNumber(endRange)}</span> দেখানো হচ্ছে
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container-high text-on-surface-variant disabled:opacity-50 transition-all font-sans"
        >
          <MaterialIcon name="chevron_left" size={20} />
        </button>
        <div className="flex items-center gap-1">
          {renderPageButtons()}
        </div>
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container-high text-on-surface-variant disabled:opacity-50 transition-all font-sans"
        >
          <MaterialIcon name="chevron_right" size={20} />
        </button>
      </div>
    </div>
  );
};
