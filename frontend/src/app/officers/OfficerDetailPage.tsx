import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { MaterialIcon } from '../../components/atoms/Icons';
import { officerService } from '../../services/officer.service';
import { Badge } from '../../components/atoms/Badge';
import { ConfirmDialog } from '../../components/molecules/ConfirmDialog';

export default function OfficerDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [officer, setOfficer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchOfficer = async () => {
      try {
        setLoading(true);
        if (!id) return;
        const data = await officerService.getById(id);
        setOfficer(data);
      } catch (error) {
        console.error('Failed to fetch officer details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfficer();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (!id) return;
      await officerService.delete(id);
      navigate('/officers');
    } catch (error) {
      console.error('Failed to delete officer:', error);
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || '??';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!officer) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-outline-variant space-y-4">
        <MaterialIcon name="person_off" size={64} className="text-on-surface-variant/20 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-on-surface">অফিসার পাওয়া যায়নি</h2>
        <button onClick={() => navigate('/officers')} className="mt-4 text-primary font-bold">তালিকায় ফিরে যান</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1, x: -4 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/officers')}
          className="w-12 h-12 flex items-center justify-center bg-transparent hover:bg-surface-container-high rounded-full text-primary transition-all group"
        >
          <MaterialIcon name="arrow_back" size={24} className="group-hover:-translate-x-1 transition-transform" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight font-sans">অফিসার প্রোফাইল</h1>
          <p className="text-sm text-on-surface-variant font-medium">কর্মকর্তার বিস্তারিত তথ্য ও বরাদ্দকৃত সম্পদ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Officer Profile Card */}
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-container-lowest rounded-[32px] border border-outline-variant shadow-xl overflow-hidden relative"
          >
            {/* Header Image/Background */}
            <div className="h-28 bg-primary/10 relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 flex flex-wrap gap-2 p-2">
                 {Array(50).fill(0).map((_, i) => <MaterialIcon key={i} name="person" size={24} />)}
               </div>
            </div>

            {/* Profile Content */}
            <div className="relative pt-0 flex flex-col items-center">
              <div className="absolute -top-14 border-[6px] border-surface-container-lowest w-28 h-28 rounded-[28px] overflow-hidden shadow-2xl bg-white group cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95">
                {officer.photoUrl ? (
                  <img 
                    src={officer.photoUrl.startsWith('http') ? officer.photoUrl : `http://localhost:5000${officer.photoUrl}`} 
                    alt={officer.name} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('placehold.co')) {
                        target.src = 'https://placehold.co/400x400/f3f4f6/6b7280?text=Error';
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-container text-primary font-black text-3xl font-sans">
                    {getInitials(officer.name)}
                  </div>
                )}
              </div>
            </div>
            <div className="pt-16 p-8 space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-black text-on-surface tracking-tight leading-tight">{officer.name}</h2>
                <div className="mt-2 flex flex-col items-center gap-2">
                  <Badge 
                    label={officer.designation} 
                    variant="primary" 
                    showDot={false}
                  />
                  {officer.branch && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant/30">
                      <MaterialIcon name="domain" size={14} className="text-primary" />
                      {officer.branch.name}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-outline-variant/50">
                <InfoItem icon="phone" label="ফোন" value={officer.phone} />
                <InfoItem icon="mail" label="ইমেইল" value={officer.email} />
                <InfoItem icon="calendar_today" label="যোগদানের তারিখ" value={new Date(officer.createdAt).toLocaleDateString('bn-BD')} />
                <div className="flex items-center justify-between py-2">
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest leading-none">স্ট্যাটাস</span>
                  <Badge 
                    label={officer.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'} 
                    variant={officer.isActive ? 'success' : 'error'} 
                  />
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/officers/edit/${officer.id}`)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-surface-container-high hover:bg-primary/10 text-on-surface-variant hover:text-primary rounded-2xl font-black text-sm transition-all border border-outline-variant"
                >
                  <MaterialIcon name="edit" size={20} />
                  তথ্য পরিবর্তন করুন
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/officers/transfer/${officer.id}`)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-on-primary rounded-2xl font-bold transition-all shadow-lg shadow-primary/10"
                >
                  <MaterialIcon name="sync_alt" size={18} />
                  ট্রান্সফার বা রিলিজ করুন
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-error-container/20 hover:bg-error-container text-error rounded-2xl font-black text-sm transition-all border border-error/10"
                >
                  <MaterialIcon name="delete" size={20} />
                  অফিসার ডিলিট করুন
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Assigned Assets List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/10 shadow-sm">
                <MaterialIcon name="inventory_2" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-on-surface tracking-tight leading-none mb-1">বরাদ্দকৃত সম্পদসমূহ</h3>
                <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider leading-none">মোট {officer.assignments?.length || 0}টি আইটেম</p>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/assignments/issue')}
              className="px-6 py-2 bg-primary text-on-primary rounded-full text-xs font-black shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <MaterialIcon name="add" size={16} />
              নতুন বরাদ্দ
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {officer.assignments && officer.assignments.length > 0 ? (
              officer.assignments.map((assignment: any, index: number) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/inventory/${assignment.asset.id}`)}
                  className="bg-surface-container-lowest rounded-[28px] border border-outline-variant p-5 flex gap-5 hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[100px] -mr-8 -mt-8 pointer-events-none group-hover:bg-primary/10 transition-colors" />
                  
                  <div className="w-24 h-24 rounded-2xl bg-surface-container-low overflow-hidden flex-shrink-0 border border-outline-variant shadow-inner p-2">
                    <img 
                      src={assignment.asset?.imageUrl || assignment.asset?.initialImageUrl || 'https://picsum.photos/seed/device/200/200'}
                      alt={assignment.asset?.model || 'Asset'} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <Badge 
                          label={assignment.asset?.category?.name || assignment.asset?.category || 'N/A'} 
                          variant="secondary" 
                          showDot={false}
                        />
                        <MaterialIcon name="arrow_forward" size={18} className="text-on-surface-variant/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                      <h4 className="font-black text-on-surface text-base group-hover:text-primary transition-colors truncate">{assignment.asset?.brand || ''} {assignment.asset?.model || 'Unknown Device'}</h4>
                      <p className="text-[11px] font-black text-on-surface-variant font-mono tracking-wider bg-surface-container-high w-max px-2 py-0.5 rounded-lg mt-1 border border-outline-variant/30 uppercase">
                        {assignment.asset?.assetTag || 'NO-TAG'}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant bg-primary/5 px-2.5 py-1 rounded-full">
                        <MaterialIcon name="calendar_month" size={14} className="text-primary" />
                        {assignment.issueDate ? new Date(assignment.issueDate).toLocaleDateString('bn-BD') : '---'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 bg-surface-container-low/30 rounded-[32px] border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center text-on-surface-variant text-center px-8">
                <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-6">
                  <MaterialIcon name="inventory_2" size={40} className="opacity-30" />
                </div>
                <h4 className="text-lg font-black text-on-surface mb-2">কোনো বরাদ্দ নেই</h4>
                <p className="text-sm font-bold text-on-surface-variant max-w-xs mb-8">এই কর্মকর্তার নামে বর্তমানে কোনো আইসিটি সরঞ্জাম বরাদ্দ করা হয়নি।</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/assignments/issue')}
                  className="bg-primary text-on-primary px-8 py-3.5 rounded-full text-sm font-black shadow-xl shadow-primary/20 flex items-center gap-3"
                >
                  <MaterialIcon name="add" size={20} />
                  নতুন এসেট বরাদ্দ দিন
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="অফিসার মুছে ফেলতে চান?"
        message={`আপনি কি নিশ্চিত যে ${officer.name}-কে সিস্টেম থেকে মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।`}
        confirmLabel="হ্যাঁ, ডিলেট করুন"
        cancelLabel="না, থাক"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: string, label: string, value: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant">
        <MaterialIcon name={icon} size={16} />
      </div>
      <div>
        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-sm font-bold text-on-surface leading-none">{value || 'N/A'}</p>
      </div>
    </div>
  );
}
