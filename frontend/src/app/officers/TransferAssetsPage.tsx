import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MaterialIcon } from '../../components/atoms/Icons';

// Mock data for officers (same as in Detail Page)
const mockOfficers = [
  {
    "id": 47,
    "name": "Recipient Officer",
    "designation": "সিনিয়র সিস্টেম অ্যানালিস্ট",
    "department": "আইসিটি শাখা",
    "phone": "01712345678",
    "email": "officer@example.gov.bd",
    "photoUrl": "https://picsum.photos/seed/officer1/200/200",
    "isActive": true,
    "assignments": [
      {
        "id": 1,
        "asset": {
          "id": 101,
          "assetTag": "LAP-001",
          "brand": "Dell",
          "model": "Latitude 5420",
          "category": "Laptop",
          "imageUrl": "https://picsum.photos/seed/laptop1/300/200"
        }
      },
      {
        "id": 2,
        "asset": {
          "id": 102,
          "assetTag": "MON-005",
          "brand": "HP",
          "model": "EliteDisplay E243",
          "category": "Monitor",
          "imageUrl": "https://picsum.photos/seed/monitor1/300/200"
        }
      },
      {
        "id": 3,
        "asset": {
          "id": 103,
          "assetTag": "KBD-099",
          "brand": "Logitech",
          "model": "K120",
          "category": "Keyboard",
          "imageUrl": "https://picsum.photos/seed/kbd1/300/200"
        }
      }
    ]
  }
];

const departments = [
  "আইসিটি শাখা",
  "প্রশাসন শাখা",
  "হিসাব শাখা",
  "পরিকল্পনা শাখা",
  "উন্নয়ন শাখা"
];

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
  const [newDept, setNewDept] = useState('');
  const [targetOfficerId, setTargetOfficerId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = mockOfficers.find(o => o.id === Number(id));
    if (found) {
      setOfficer(found);
      setSelectedAssets(found.assignments.map((a: any) => a.asset.id));
      setNewDept(found.department);
    }
    setLoading(false);
  }, [id]);

  const toggleAsset = (assetId: number) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) ? prev.filter(id => id !== assetId) : [...prev, assetId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAssets.length === officer.assignments.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(officer.assignments.map((a: any) => a.asset.id));
    }
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for transfer
    let message = "";
    if (transferType === 'department') {
      message = `${selectedAssets.length}টি সম্পদসহ অফিসারকে ${newDept}-এ স্থানান্তর করা হয়েছে।`;
    } else if (transferType === 'officer') {
      const target = otherOfficers.find(o => o.id === Number(targetOfficerId));
      message = `${selectedAssets.length}টি সম্পদ ${target?.name}-এর কাছে হস্তান্তর করা হয়েছে।`;
    } else {
      message = `${selectedAssets.length}টি সম্পদ স্টোরে ফেরত নেওয়া হয়েছে।`;
    }
    
    alert(message);
    navigate(`/officers/${id}`);
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
          <h1 className="text-xl md:text-2xl font-black text-primary tracking-tight font-sans">ট্রান্সফার ও রিলিজ</h1>
          <p className="text-[10px] md:text-sm text-on-surface-variant font-medium">অফিসার বদলি বা সম্পদ হস্তান্তর</p>
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
                onClick={handleSelectAll}
                className="text-[9px] md:text-[10px] font-black text-primary hover:bg-primary/10 px-2 md:px-3 py-1 rounded-full transition-all"
              >
                {selectedAssets.length === officer.assignments.length ? 'সব বাদ দিন' : 'সব সিলেক্ট করুন'}
              </button>
            </div>
            
            <div className="p-3 md:p-4 space-y-2 md:space-y-3 max-h-[400px] md:max-h-[500px] overflow-y-auto custom-scrollbar">
              {officer.assignments.map((assignment: any) => (
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
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-surface-container-high overflow-hidden border border-outline-variant flex-shrink-0">
                    <img src={assignment.asset.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-on-surface text-xs md:text-sm truncate">{assignment.asset.brand} {assignment.asset.model}</p>
                    <p className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{assignment.asset.assetTag}</p>
                  </div>
                  <span className="hidden sm:block text-[9px] md:text-[10px] font-black text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-md">
                    {assignment.asset.category}
                  </span>
                </div>
              ))}
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
                        value={newDept}
                        onChange={(e) => setNewDept(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
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
                        নির্বাচিত সম্পদগুলো সরাসরি অন্য একজন অফিসারের নামে বরাদ্দ হয়ে যাবে।
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2">গ্রহীতা অফিসার</label>
                      <select 
                        required
                        value={targetOfficerId}
                        onChange={(e) => setTargetOfficerId(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-4 py-3 font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">অফিসার নির্বাচন করুন</option>
                        {otherOfficers.map(o => (
                          <option key={o.id} value={o.id}>{o.name} ({o.designation})</option>
                        ))}
                      </select>
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
                        নির্বাচিত সম্পদগুলো অফিসারের নাম থেকে বাদ দিয়ে স্টোরে (Available) ফেরত নেওয়া হবে।
                      </p>
                    </div>
                    <div className="p-6 border-2 border-dashed border-outline-variant rounded-2xl text-center">
                      <MaterialIcon name="inventory_2" size={32} className="text-on-surface-variant/30 mb-2" />
                      <p className="text-xs font-bold text-on-surface-variant">সম্পদগুলো সরাসরি ইনভেন্টরিতে যুক্ত হবে</p>
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
