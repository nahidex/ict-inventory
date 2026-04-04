import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MaterialIcon } from '../../components/atoms/Icons';
import AssetTable from '../../components/organisms/AssetTable';
import { assetService } from '../../services/asset.service';

export default function InventoryPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    maintenance: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await assetService.getAll(1, 1);
        const total = response.meta.total;
        setStats(prev => ({ ...prev, total }));
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []); // Empty dependency array means it only runs once on mount

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-left"
        >
          <h1 className="text-2xl font-black text-primary tracking-tight font-sans">ইনভেন্টরি ম্যানেজমেন্ট</h1>
          <p className="text-sm text-on-surface-variant font-medium">অফিসের সকল কিউআর কোড যুক্ত সম্পদের তালিকা</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/inventory/add')}
            className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold shadow-lg shadow-primary/20 transition-all self-start"
          >
            <MaterialIcon name="add" size={20} />
            নতুন এসেট যোগ করুন
          </motion.button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-outline-variant shadow-sm border-l-4 border-l-primary/30">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <MaterialIcon name="inventory_2" size={24} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest leading-none mb-1">মোট সম্পদ</p>
              <h3 className="text-2xl font-black text-on-surface leading-none">{stats.total}টি</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-outline-variant shadow-sm border-l-4 border-l-emerald-500/30">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <MaterialIcon name="check_circle" size={24} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest leading-none mb-1">উপলব্ধ</p>
              <h3 className="text-2xl font-black text-on-surface leading-none">--</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-outline-variant shadow-sm border-l-4 border-l-amber-500/30">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
              <MaterialIcon name="build" size={24} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest leading-none mb-1">মেরামতে আছে</p>
              <h3 className="text-2xl font-black text-on-surface leading-none">--</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <AssetTable />
      </div>
    </div>
  );
}
