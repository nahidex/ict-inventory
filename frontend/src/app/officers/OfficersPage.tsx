import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MaterialIcon } from '../../components/atoms/Icons';
import { officerService, Officer } from '../../services/officer.service';
import { Badge } from '../../components/atoms/Badge';
import { Pagination } from '../../components/atoms/Pagination';

export default function OfficersPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [officers, setOfficerList] = useState<Officer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });

  useEffect(() => {
    fetchOfficers(1);
  }, [searchQuery]);

  const fetchOfficers = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await officerService.getAll({ 
        search: searchQuery,
        limit: 10,
        page: page 
      });
      setOfficerList(response.data);
      setMeta(response.meta);
    } catch (error) {
      console.error('Failed to fetch officers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      fetchOfficers(newPage);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 md:px-0">
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight font-sans">অফিসার ম্যানেজমেন্ট</h1>
          <p className="text-sm text-on-surface-variant font-medium font-sans">কর্মকর্তাদের তালিকা ও তাদের বরাদ্দকৃত সম্পদের তথ্য</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/officers/add')}
          className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold shadow-lg shadow-primary/20 transition-all font-sans"
        >
          <MaterialIcon name="person_add" size={20} />
          নতুন অফিসার যোগ করুন
        </motion.button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-between bg-white p-3 md:p-4 rounded-2xl border border-outline-variant mx-1 md:mx-0 shadow-sm">
        <div className="relative w-full md:w-96">
          <MaterialIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
          <input 
            type="text"
            placeholder="নাম, পদবি বা ইমেইল..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 md:pl-12 pr-4 py-2 md:py-2.5 bg-surface-container-low border border-outline-variant rounded-full text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold transition-all text-on-surface font-sans"
          />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-outline-variant overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-4 md:px-8 py-3 md:py-4 text-[10px] md:text-xs font-black text-on-surface-variant uppercase tracking-wider font-sans">কর্মকর্তা</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-black text-on-surface-variant uppercase tracking-wider font-sans">দপ্তর/শাখা</th>
                <th className="hidden lg:table-cell px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-wider font-sans">যোগাযোগ</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-black text-on-surface-variant uppercase tracking-wider text-center font-sans">সম্পদ</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-black text-on-surface-variant uppercase tracking-wider font-sans">অবস্থা</th>
                <th className="px-4 md:px-8 py-3 md:py-4 text-[10px] md:text-xs font-black text-on-surface-variant uppercase tracking-wider text-right font-sans">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-10 bg-white/50" />
                  </tr>
                ))
              ) : officers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-on-surface-variant font-bold font-sans">
                    কোন অফিসার পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                officers.map((officer, index) => (
                  <motion.tr 
                    key={officer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/officers/${officer.id}`)}
                  >
                    <td className="px-4 md:px-8 py-3 md:py-4">
                      <div className="flex items-center gap-2 md:gap-4">
                        <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-primary/5 flex items-center justify-center text-[10px] font-black text-primary border border-primary/10 overflow-hidden flex-shrink-0">
                          {officer.photoUrl ? (
                            <img 
                              src={officer.photoUrl} 
                              alt={officer.name} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="font-sans">{getInitials(officer.name)}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-black text-on-surface text-xs md:text-sm font-sans">{officer.name}</div>
                          <div className="text-[10px] md:text-[11px] text-on-surface-variant font-bold font-sans">{officer.designation}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-left">
                      <Badge 
                        label={officer.branch?.name || 'ব্রাঞ্চ ছাড়া'} 
                        variant={officer.branch ? 'primary' : 'neutral'} 
                        showDot={false}
                      />
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-on-surface font-bold text-sm font-sans">
                          <MaterialIcon name="call" size={16} className="text-primary" />
                          {officer.phone}
                        </div>
                        <div className="flex items-center gap-1.5 text-on-surface-variant font-medium text-xs font-sans">
                          <MaterialIcon name="mail" size={16} className="text-secondary" />
                          {officer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-center">
                      <div className="inline-flex items-center justify-center">
                        <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary font-black text-base ring-1 ring-primary/20 shadow-sm font-sans">
                          {officer._count?.assignments || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <Badge 
                        label={officer.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'} 
                        variant={officer.isActive ? 'success' : 'error'} 
                      />
                    </td>
                    <td className="px-4 md:px-8 py-3 md:py-4 text-right">
                      <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => navigate(`/officers/edit/${officer.id}`)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-primary/10 rounded-full text-primary transition-colors" 
                          title="এডিট"
                        >
                          <MaterialIcon name="edit" size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination 
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          itemsPerPage={10}
          onPageChange={handlePageChange}
          label="অফিসার"
        />
      </motion.div>
    </div>
  );
}
