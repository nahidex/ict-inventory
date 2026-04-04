import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MaterialIcon } from '../../components/atoms/Icons';
import { officerService } from '../../services/officer.service';
import { branchService, Branch } from '../../services/branch.service';

const otherOfficers = [
  { id: 48, name: "Sultana Razia", designation: "প্রোগ্রামার" },
  { id: 49, name: "Md. Abdul Karim", designation: "সহকারী প্রোগ্রামার" },
  { id: 50, name: "New Joining Officer", designation: "অপেক্ষমান" }
];

export default function TransferAssetsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [officer, setOfficer] = useState<any>(null);
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
  const [transferType, setTransferType] = useState<'department' | 'officer' | 'release'>('department');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [otherOfficersList, setOtherOfficersList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newBranchId, setNewBranchId] = useState('');
  const [targetOfficerId, setTargetOfficerId] = useState('');
  const [loading, setLoading] = useState(true);

  const filteredOfficers = otherOfficersList.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.designation && o.designation.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (o.branch?.name && o.branch.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!id) return;
        
        // Fetch officer, branches and all officers in parallel
        const [officerData, branchesData, allOfficersData] = await Promise.all([
          officerService.getById(id),
          branchService.getAll(),
          officerService.getAll({ limit: 1000 })
        ]);
        
        setOfficer(officerData);
        setBranches(branchesData);
        
        // Ensure we handle both paginated and non-paginated responses
        const officersList = allOfficersData?.data || (Array.isArray(allOfficersData) ? allOfficersData : []);
        // Filter out the current officer
        setOtherOfficersList(officersList.filter((o: any) => o.id.toString() !== id.toString()));
        
        // Map assignments to selected assets by default
        if (officerData && officerData.assignments) {
          setSelectedAssets(officerData.assignments.map((a: any) => a.asset.id));
        }
        
        if (officerData.branchId) {
          setNewBranchId(officerData.branchId.toString());
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleAsset = (assetId: number) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) ? prev.filter(id => id !== assetId) : [...prev, assetId]
    );
  };

  const handleSelectAll = () => {
    if (!officer?.assignments) return;
    if (selectedAssets.length === officer.assignments.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(officer.assignments.map((a: any) => a.asset.id));
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !newBranchId) {
      alert("দয়াকরে নতুন শাখা নির্বাচন করুন।");
      return;
    }

    try {
      setLoading(true);

      let assetsToCarry: number[] = [];
      let assetsToLeave: number[] = [];
      const allAssetIds = officer.assignments.map((a: any) => a.asset.id);

      if (transferType === 'officer') {
        // Handover: Selected assets go to target officer, others stay with current officer
        assetsToLeave = selectedAssets; // Those chosen to handover
        assetsToCarry = allAssetIds.filter((aid: number) => !selectedAssets.includes(aid));
      } else if (transferType === 'release') {
        // Release: Selected assets are left/released to store, others stay with officer
        assetsToLeave = selectedAssets;
        assetsToCarry = allAssetIds.filter((aid: number) => !selectedAssets.includes(aid));
      } else {
        // Department Transfer: Selected assets carry over with officer, others left behind
        assetsToCarry = selectedAssets;
        assetsToLeave = allAssetIds.filter((aid: number) => !selectedAssets.includes(aid));
      }

      const payload = {
        newBranchId: parseInt(newBranchId),
        assetsToCarry,
        assetsToLeave,
        targetOfficerId: transferType === 'officer' ? parseInt(targetOfficerId) : undefined
      };

      const result = await officerService.transfer(id, payload);
      
      alert(result.message || "অফিসার সফলভাবে স্থানান্তর করা হয়েছে।");
      navigate(`/officers/${id}`);
    } catch (error: any) {
      console.error('Transfer failed:', error);
      alert(error.response?.data?.message || "স্থানান্তর সম্পন্ন করা সম্ভব হয়নি।");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!officer) return <div className="text-center py-20 font-bold text-error">অফিসার পাওয়া যায়নি</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 md:gap-4 px-2 md:px-0">
        <motion.button
          whileHover={{ scale: 1.1, x: -4 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-transparent hover:bg-surface-container-high rounded-full text-primary transition-all group"
        >
          <MaterialIcon name="arrow_back" size={24} className="group-hover:-translate-x-1 transition-transform" />
        </motion.button>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-primary tracking-tight font-sans text-left">ট্রান্সফার ও রিলিজ</h1>
          <p className="text-[10px] md:text-sm text-on-surface-variant font-medium text-left">অফিসার বদলি বা সম্পদ হস্তান্তর</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 px-2 md:px-0">
        {/* Left: Asset Selection */}
        <div className="lg:col-span-7 space-y-4 md:space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl md:rounded-3xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="bg-surface-container-low px-4 md:px-6 py-3 md:py-4 border-b border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MaterialIcon name="checklist" className="text-primary" size={18} />
                <h2 className="font-bold text-on-surface uppercase tracking-wider text-[10px] md:text-xs">সম্পদ নির্বাচন</h2>
              </div>
              <button 
                type="button"
                onClick={handleSelectAll}
                className="text-[9px] md:text-[10px] font-black text-primary hover:bg-primary/10 px-2 md:px-3 py-1 rounded-full transition-all"
              >
                {(officer.assignments || []).length > 0 && selectedAssets.length === officer.assignments.length ? 'সব বাদ দিন' : 'সব সিলেক্ট করুন'}
              </button>
            </div>
            
            <div className="p-3 md:p-4 space-y-2 md:space-y-3 max-h-[400px] md:max-h-[500px] overflow-y-auto custom-scrollbar">
              {(officer.assignments || []).length === 0 ? (
                <div className="py-10 text-center space-y-2 text-on-surface-variant/40">
                  <MaterialIcon name="inventory_2" size={48} className="mx-auto" />
                  <p className="font-bold text-sm">কোন সম্পদ বরাদ্দ নেই</p>
                </div>
              ) : (
                officer.assignments.map((assignment: any) => (
                  <div 
                    key={assignment.asset.id}
                    onClick={() => toggleAsset(assignment.asset.id)}
                    className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedAssets.includes(assignment.asset.id)
                        ? 'bg-primary/5 border-primary shadow-sm'
                        : 'bg-surface-container-low border-transparent hover:border-outline-variant'
                    }`}
                  >
                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                      selectedAssets.includes(assignment.asset.id)
                        ? 'bg-primary border-primary text-on-primary'
                        : 'border-outline-variant'
                    }`}>
                      {selectedAssets.includes(assignment.asset.id) && <MaterialIcon name="check" size={14} />}
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-surface-container-high overflow-hidden border border-outline-variant flex-shrink-0 flex items-center justify-center">
                      {assignment.asset.imageUrl || assignment.asset.image ? (
                        <img 
                          src={assignment.asset.imageUrl || assignment.asset.image} 
                          alt="" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer" 
                          crossOrigin="anonymous"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.parentElement!.innerHTML = '<span class="material-symbols-outlined text-on-surface-variant/30 text-[24px]">devices</span>';
                          }}
                        />
                      ) : (
                        <MaterialIcon name="devices" size={24} className="text-on-surface-variant/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-black text-on-surface text-xs md:text-sm truncate">{assignment.asset.brand} {assignment.asset.model}</p>
                      <p className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{assignment.asset.assetTag}</p>
                    </div>
                    <span className="hidden sm:block text-[9px] md:text-[10px] font-black text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-md">
                      {assignment.asset.category?.name || assignment.asset.category || 'Category'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Transfer Actions */}
        <div className="lg:col-span-5">
          <form onSubmit={handleTransfer} className="bg-surface-container-lowest rounded-2xl md:rounded-3xl border border-outline-variant overflow-hidden shadow-sm lg:sticky lg:top-24">
            <div className="bg-surface-container-low px-5 md:px-6 py-3 md:py-4 border-b border-outline-variant">
              <h2 className="font-black text-on-surface tracking-tight text-sm md:text-base">অ্যাকশন নির্বাচন</h2>
            </div>
            
            <div className="p-5 md:p-6 space-y-6 md:space-y-8">
              {/* Transfer Type Tabs */}
              <div className="flex bg-surface-container-high p-1 rounded-xl md:rounded-2xl">
                <TabButton 
                  active={transferType === 'department'} 
                  onClick={() => setTransferType('department')}
                  icon="move_down"
                  label="বদলি"
                />
                <TabButton 
                  active={transferType === 'officer'} 
                  onClick={() => setTransferType('officer')}
                  icon="handshake"
                  label="হস্তান্তর"
                />
                <TabButton 
                  active={transferType === 'release'} 
                  onClick={() => setTransferType('release')}
                  icon="release_alert"
                  label="রিলিজ"
                />
              </div>

              <AnimatePresence mode="wait">
                {transferType === 'department' && (
                  <motion.div 
                    key="dept"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20">
                      <p className="text-xs font-medium text-on-surface-variant leading-relaxed">
                        অফিসার নতুন শাখায় বদলি হলে তার নির্বাচিত সম্পদগুলোও তার সাথে নতুন শাখায় স্থানান্তরিত হবে।
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2">নতুন শাখা/বিভাগ</label>
                      <select 
                        value={newBranchId}
                        onChange={(e) => setNewBranchId(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">শাখা নির্বাচন করুন</option>
                        {branches.map(branch => (
                          <option key={branch.id} value={branch.id.toString()}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}

                {transferType === 'officer' && (
                  <motion.div 
                    key="officer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                      <p className="text-xs font-medium text-amber-900 leading-relaxed">
                        যে সম্পদগুলো আপনি <b>নির্বাচন করবেন না (Uncheck)</b>, সেগুলো নিচের অফিসারের কাছে হস্তান্তরিত হবে।
                      </p>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2">গ্রহীতা অফিসার</label>
                      
                      {/* Search Bar for Officers */}
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant/50 group-focus-within:text-primary transition-colors">
                          <MaterialIcon name="search" size={18} />
                        </div>
                        <input
                          type="text"
                          placeholder="নাম, পদবি বা শাখা দিয়ে খুঁজুন..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-surface-container-low border border-outline-variant rounded-2xl pl-11 pr-4 py-2.5 text-xs font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-on-surface-variant/40"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredOfficers.length === 0 ? (
                          <div className="text-center py-8 space-y-2 bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
                            <MaterialIcon name="person_search" size={32} className="mx-auto text-on-surface-variant/20" />
                            <p className="text-[10px] font-bold text-on-surface-variant">কোন অফিসার পাওয়া যায়নি</p>
                          </div>
                        ) : (
                          filteredOfficers.map(o => (
                            <div 
                              key={o.id}
                              onClick={() => setTargetOfficerId(o.id.toString())}
                              className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                                targetOfficerId === o.id.toString()
                                  ? 'bg-primary/5 border-primary shadow-sm'
                                  : 'bg-surface-container-low border-transparent hover:border-outline-variant'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                targetOfficerId === o.id.toString() ? 'bg-primary border-primary text-on-primary' : 'border-outline-variant'
                              }`}>
                                {targetOfficerId === o.id.toString() && <div className="w-2 h-2 bg-on-primary rounded-full" />}
                              </div>
                              <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant flex-shrink-0">
                                {o.photoUrl ? (
                                  <img src={o.photoUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                                    <MaterialIcon name="person" size={20} />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-on-surface text-xs truncate">{o.name}</p>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[9px] font-medium text-on-surface-variant">{o.designation}</span>
                                  <span className="w-1 h-1 bg-outline-variant rounded-full" />
                                  <span className="text-[9px] font-bold text-primary uppercase">{o.branch?.name || 'কোন শাখা নেই'}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <input type="hidden" required value={targetOfficerId} />
                    </div>
                  </motion.div>
                )}

                {transferType === 'release' && (
                  <motion.div 
                    key="release"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="p-4 bg-error/5 rounded-2xl border border-error/20">
                      <p className="text-xs font-medium text-error leading-relaxed">
                        যে সম্পদগুলো আপনি <b>নির্বাচন (Check) করবেন</b>, সেগুলো অফিসারের নাম থেকে রিলিজ করে সরাসরি ইনভেন্টরিতে (Available) ফেরত নেওয়া হবে।
                      </p>
                    </div>
                    <div className="p-6 border-2 border-dashed border-outline-variant rounded-2xl text-center space-y-2">
                      <div className="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-2">
                        <MaterialIcon name="inventory_2" size={24} />
                      </div>
                      <p className="text-[10px] font-black text-on-surface uppercase tracking-widest">ইনভেন্টরি রিটার্ন</p>
                      <p className="text-[10px] font-bold text-on-surface-variant">নির্বাচিত {selectedAssets.length} টি সম্পদ স্টোরে জমা হবে</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={selectedAssets.length === 0}
                  type="submit"
                  className="w-full bg-primary text-on-primary py-4 rounded-2xl font-black shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <MaterialIcon name="sync_alt" size={20} />
                  প্রসেস সম্পন্ন করুন
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl transition-all gap-1 ${
        active 
          ? 'bg-surface-container-lowest text-primary shadow-sm' 
          : 'text-on-surface-variant hover:text-on-surface'
      }`}
    >
      <MaterialIcon name={icon} size={20} />
      <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );
}
