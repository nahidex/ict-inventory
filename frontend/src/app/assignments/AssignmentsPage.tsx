import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MaterialIcon } from '../../components/atoms/Icons';
import { assignmentService, Assignment } from '../../services/assignment.service';

export default function AssignmentsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setIsLoading(true);
        const data = await assignmentService.getAll();
        setAssignments(data);
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '---';
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const filteredAssignments = assignments.filter(item => 
    (item.asset?.assetTag?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     item.officer?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 md:px-0">
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight font-sans">ইস্যু ও রিটার্ন ম্যানেজমেন্ট</h1>
          <p className="text-sm text-on-surface-variant font-medium">সম্পদ বরাদ্দ এবং ফেরত প্রদানের বিস্তারিত তালিকা</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/assignments/issue')}
            className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold shadow-lg shadow-primary/20 transition-all"
          >
            <MaterialIcon name="add_task" size={20} />
            নতুন ইস্যু করুন
          </motion.button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant">
        <div className="relative w-full md:w-96">
          <MaterialIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
          <input 
            type="text"
            placeholder="এসেট ট্যাগ বা অফিসারের নাম দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select className="flex-1 md:flex-none pl-4 pr-10 py-2.5 bg-surface-container-low border border-outline-variant rounded-full text-xs font-bold text-on-surface-variant focus:outline-none appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat">
            <option>সকল স্ট্যাটাস</option>
            <option>ইস্যুকৃত (Issued)</option>
            <option>ফেরতকৃত (Returned)</option>
          </select>
        </div>
      </div>

      {/* Assignments Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-4 md:px-8 py-3 md:py-4 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">এসেট তথ্য</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">অফিসার</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">ইস্যুর তারিখ</th>
                <th className="hidden lg:table-cell px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">রিটার্ন তারিখ</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">অবস্থা</th>
                <th className="px-4 md:px-8 py-3 md:py-4 text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      <span className="text-sm font-bold text-on-surface-variant">লোড হচ্ছে...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-on-surface-variant/40">
                      <MaterialIcon name="assignment_late" size={48} />
                      <span className="text-sm font-bold">কোনো অ্যাসাইনমেন্ট পাওয়া যায়নি</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((item, index) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/assignments/${item.id}`)}
                  >
                    <td className="px-4 md:px-8 py-3 md:py-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-secondary-container flex items-center justify-center text-secondary shadow-sm">
                          <MaterialIcon name="devices" size={16} />
                        </div>
                        <div>
                          <div className="font-bold text-on-surface text-xs md:text-sm tracking-tight">{item.asset?.assetTag || '---'}</div>
                          <div className="text-[9px] md:text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">
                            {item.asset?.brand || ''} {item.asset?.model || ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary-container flex items-center justify-center text-[8px] md:text-[10px] font-black text-primary border border-primary/10 overflow-hidden shadow-sm">
                          {item.officer?.photoUrl ? (
                            <img src={item.officer.photoUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            getInitials(item.officer?.name || '')
                          )}
                        </div>
                        <div>
                          <div className="text-xs md:text-sm font-bold text-on-surface tracking-tight">{item.officer?.name || 'অজানা'}</div>
                          <div className="hidden md:block text-[10px] text-on-surface-variant font-medium">{item.officer?.designation || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="text-xs md:text-sm font-medium text-on-surface">{formatDate(item.issueDate)}</div>
                      <div className="hidden md:block text-[10px] text-on-surface-variant uppercase tracking-wider">সিস্টেম জেনারেটেড</div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4">
                      <div className="text-sm font-medium text-on-surface">{formatDate(item.actualReturnDate)}</div>
                      {item.returnCondition && (
                        <div className="text-[10px] text-on-surface-variant uppercase tracking-wider">অবস্থা: {item.returnCondition}</div>
                      )}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span className={`inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-[11px] font-bold ring-1 ring-inset ${
                        !item.actualReturnDate 
                          ? 'bg-amber-100 text-amber-800 ring-amber-600/20 shadow-sm' 
                          : 'bg-green-100 text-green-800 ring-green-600/20 shadow-sm'
                      }`}>
                        <span className={`w-1 md:w-1.5 h-1 md:h-1.5 rounded-full ${!item.actualReturnDate ? 'bg-amber-600' : 'bg-green-600'}`}></span>
                        {!item.actualReturnDate ? 'ইস্যুকৃত' : 'ফেরতকৃত'}
                      </span>
                    </td>
                    <td className="px-4 md:px-8 py-3 md:py-4 text-right">
                      {!item.actualReturnDate ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/assignments/return/${item.id}`);
                          }}
                          className="text-[10px] md:text-xs font-bold text-primary hover:bg-primary/10 px-2 md:px-4 py-1.5 md:py-2 rounded-full transition-colors flex items-center gap-1 ml-auto border border-primary/20 shadow-sm"
                        >
                          <MaterialIcon name="assignment_return" size={14} />
                          ফেরত
                        </button>
                      ) : (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/assignments/${item.id}`);
                          }}
                          className="p-1.5 md:p-2 hover:bg-surface-container-high rounded-full text-on-surface-variant transition-colors" title="বিস্তারিত"
                        >
                          <MaterialIcon name="visibility" size={16} />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

