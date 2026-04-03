import { motion } from 'motion/react';
import { MaterialIcon } from '../atoms/Icons';

const distributions = [
  { label: 'প্রশাসন শাখা', value: 45, color: 'bg-primary' },
  { label: 'বাজেট ও হিসাব', value: 25, color: 'bg-secondary' },
  { label: 'আইসিটি সেল', value: 20, color: 'bg-tertiary' },
  { label: 'অন্যান্য', value: 10, color: 'bg-outline' },
];

export default function DistributionCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-surface-container-low rounded-2xl border border-outline-variant p-6 flex flex-col gap-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-on-surface">সম্পদ বণ্টন</h3>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors">
          <MaterialIcon name="more_vert" size={20} />
        </button>
      </div>

      <div className="flex h-10 w-full rounded-full border border-outline overflow-hidden">
        <button className="flex-1 bg-secondary-container text-on-secondary-container text-xs font-bold border-r border-outline hover:bg-secondary-container/80 transition-colors">বিভাগ</button>
        <button className="flex-1 text-on-surface-variant text-xs font-bold border-r border-outline hover:bg-surface-container-high transition-colors">ধরণ</button>
        <button className="flex-1 text-on-surface-variant text-xs font-bold hover:bg-surface-container-high transition-colors">অবস্থা</button>
      </div>

      <div className="space-y-5 px-1">
        {distributions.map((item, idx) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-on-surface">{item.label}</span>
              <span className="text-on-surface-variant font-bold font-sans">{item.value}%</span>
            </div>
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ delay: 0.8 + idx * 0.1, duration: 1, ease: "easeOut" }}
                className={`h-full ${item.color} rounded-full`}
              />
            </div>
          </div>
        ))}
      </div>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-2.5 border border-outline text-primary font-bold rounded-full hover:bg-primary/5 transition-all text-sm"
      >
        বিস্তারিত রিপোর্ট দেখুন
      </motion.button>
    </motion.div>
  );
}
