import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MaterialIcon } from '../../components/atoms/Icons';
import maintenanceService from '../../services/maintenance.service';
import Avatar from '../../components/atoms/Avatar';

interface MaintenanceRecord {
  id: number;
  asset_id: number;
  issue_description: string;
  sent_date: string;
  repair_status: string;
  repair_cost: number;
  vendor_name: string;
  assets?: {
    assetTag: string;
    brand: string;
    model: string;
    initialImageUrl?: string;
    category?: {
      name: string;
    };
  };
  officers?: {
    name: string;
    designation: string;
    photoUrl?: string;
    branch?: {
      name: string;
    };
  };
}

export default function MaintenancePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMaintenances = async () => {
      try {
        setLoading(true);
        const data = await maintenanceService.getAll();
        setMaintenances(data);
      } catch (error) {
        console.error('Failed to fetch maintenance data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMaintenances();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '---';
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800 ring-amber-600/20';
      case 'In Progress': return 'bg-blue-100 text-blue-800 ring-blue-600/20';
      case 'Completed': return 'bg-emerald-100 text-emerald-800 ring-emerald-600/20';
      case 'Unrepairable': return 'bg-rose-100 text-rose-800 ring-rose-600/20';
      default: return 'bg-gray-100 text-gray-800 ring-gray-600/20';
    }
  };

  const filteredData = (maintenances || []).filter(m => 
    m.assets?.assetTag?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.vendor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.issue_description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-2xl font-black text-primary tracking-tight font-sans">মেরামত ও রক্ষণাবেক্ষণ</h1>
          <p className="text-sm text-on-surface-variant font-medium">সম্পদ সমূহের মেরামত রিকোয়েস্ট এবং লগের বিস্তারিত তালিকা</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/maintenance/request')}
            className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold shadow-lg shadow-primary/20 transition-all"
          >
            <MaterialIcon name="build" size={20} />
            মেরামত রিকোয়েস্ট করুন
          </motion.button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="চলমান মেরামত" value={maintenances.filter(m => m.repair_status === 'Pending' || m.repair_status === 'In Progress').length} icon="engineering" color="amber" />
        <StatCard title="সম্পন্ন হয়েছে" value={maintenances.filter(m => m.repair_status === 'Completed').length} icon="verified" color="emerald" />
        <StatCard title="অযোগ্য সম্পদ" value={maintenances.filter(m => m.repair_status === 'Unrepairable').length} icon="dangerous" color="rose" />
        <StatCard title="মোট খরচ" value={`৳${maintenances.reduce((acc, curr) => acc + Number(curr.repair_cost || 0), 0).toLocaleString('bn-BD')}`} icon="payments" color="blue" />
      </div>

      {/* Table Section */}
      <div className="bg-surface-container-lowest rounded-[32px] border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <MaterialIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
            <input 
              type="text"
              placeholder="এসেট ট্যাগ বা ভেন্ডরের নাম দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">এসেট তথ্য</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">অফিসার ও শাখা</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">ভেন্ডর ও তারিখ</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">সমস্যার বিবরণ</th>
                <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">অবস্থা</th>
                <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      <span className="text-sm font-bold text-on-surface-variant">লোড হচ্ছে...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-on-surface-variant/40">
                      <MaterialIcon name="construction" size={48} />
                      <span className="text-sm font-bold tracking-tight">কোনো মেরামত রেকর্ড পাওয়া যায়নি</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low/30 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-secondary shadow-sm overflow-hidden border border-outline-variant">
                          {item.assets?.initialImageUrl ? (
                            <img src={item.assets.initialImageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <MaterialIcon name="devices" size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-on-surface text-sm leading-none mb-1 group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/inventory/${item.asset_id}`)}>
                            {item.assets?.assetTag || '---'}
                          </p>
                          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                            {item.assets?.category?.name || 'অজ্ঞাত ক্যাটাগরি'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.officers ? (
                        <div className="flex items-center gap-3">
                          <Avatar 
                            src={item.officers.photoUrl} 
                            name={item.officers.name} 
                            size="md" 
                          />
                          
                          <div className="flex flex-col min-w-0">
                            <p className="text-sm font-bold text-on-surface leading-tight truncate">{item.officers.name}</p>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tight">{item.officers.designation}</span>
                              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                              <span className="text-[10px] text-primary font-bold uppercase tracking-tight truncate">{item.officers.branch?.name}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-on-surface-variant/40 font-medium italic">অফিসার উল্লেখ নেই</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-on-surface leading-none mb-1">{item.vendor_name || 'সরাসরি মেরামত'}</p>
                      <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">পাঠানো: {formatDate(item.sent_date)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-on-surface font-medium line-clamp-2 max-w-[250px] italic">"{item.issue_description}"</p>
                      {Number(item.repair_cost) > 0 && (
                        <p className="text-[10px] text-primary font-black mt-1">ব্যয়: ৳{Number(item.repair_cost).toLocaleString('bn-BD')}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ring-1 ring-inset ${getStatusColor(item.repair_status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.repair_status === 'Pending' ? 'bg-amber-600' : 
                            item.repair_status === 'Completed' ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}></span>
                          {item.repair_status === 'Pending' ? 'পেন্ডিং' : 
                           item.repair_status === 'Completed' ? 'সম্পন্ন' : 
                           item.repair_status === 'Unrepairable' ? 'মেরামত অযোগ্য' : 'চলমান'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      {item.repair_status === 'Pending' ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/maintenance/${item.id}/receive`)}
                          className="bg-primary text-on-primary px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
                        >
                          রিসিভ করুন
                        </motion.button>
                      ) : (
                        <button 
                          onClick={() => navigate(`/maintenance/${item.id}`)}
                          className="w-8 h-8 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant inline-flex items-center justify-center border border-outline-variant"
                        >
                          <MaterialIcon name="visibility" size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: string | number, icon: string, color: 'amber' | 'emerald' | 'rose' | 'blue' }) {
  const colorMap = {
    amber: 'bg-amber-50 text-amber-600 border-l-amber-500/30',
    emerald: 'bg-emerald-50 text-emerald-600 border-l-emerald-500/30',
    rose: 'bg-rose-50 text-rose-600 border-l-rose-500/30',
    blue: 'bg-blue-50 text-blue-600 border-l-blue-500/30'
  };

  return (
    <div className={`bg-white p-5 rounded-[28px] border border-outline-variant shadow-sm border-l-4 ${colorMap[color]}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${color === 'amber' ? 'bg-amber-100' : color === 'emerald' ? 'bg-emerald-100' : color === 'rose' ? 'bg-rose-100' : 'bg-blue-100'} rounded-2xl flex items-center justify-center`}>
          <MaterialIcon name={icon} size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest leading-none mb-1.5">{title}</p>
          <h3 className="text-xl font-black text-on-surface leading-none tracking-tight">{value}</h3>
        </div>
      </div>
    </div>
  );
}
