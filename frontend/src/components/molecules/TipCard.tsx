import { motion } from 'motion/react';
import { MaterialIcon } from '../atoms/Icons';

export default function TipCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-primary-container text-on-primary-container p-5 rounded-2xl border border-primary/20"
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <MaterialIcon name="lightbulb" className="text-primary" size={24} fill />
        </div>
        <div>
          <p className="text-sm font-bold mb-1">পরামর্শ</p>
          <p className="text-[13px] leading-relaxed opacity-90">
            ৫টির বেশি ডিভাইস ৩ মাসের বেশি সময় ধরে মেরামতে আছে। দয়া করে সার্ভিসিং স্ট্যাটাস চেক করুন।
          </p>
        </div>
      </div>
    </motion.div>
  );
}
