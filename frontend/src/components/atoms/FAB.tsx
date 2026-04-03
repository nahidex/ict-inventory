import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MaterialIcon } from './Icons';

export default function FAB() {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1, brightness: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate('/inventory/add')}
      className="fixed bottom-8 right-8 flex items-center gap-3 bg-primary text-on-primary px-6 py-4 rounded-full m3-elevation-2 hover:m3-elevation-2 transition-all z-50"
    >
      <MaterialIcon name="add" size={24} />
      <span className="font-bold tracking-tight">নতুন এসেট</span>
    </motion.button>
  );
}
