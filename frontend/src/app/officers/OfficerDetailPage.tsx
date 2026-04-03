import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { MaterialIcon } from '../../components/atoms/Icons';

// Mock data for officers (expanded with assignments)
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
    "createdAt": "2026-04-01T08:21:22.055Z",
    "assignments": [
      {
        "id": 1,
        "asset": {
          "id": 101,
          "assetTag": "LAP-001",
          "brand": "Dell",
          "model": "Latitude 5420",
          "category": "Laptop",
          "imageUrl": "https://picsum.photos/seed/laptop1/300/200",
          "status": "Assigned"
        },
        "issueDate": "2026-01-10T10:00:00.000Z"
      },
      {
        "id": 2,
        "asset": {
          "id": 102,
          "assetTag": "MON-005",
          "brand": "HP",
          "model": "EliteDisplay E243",
          "category": "Monitor",
          "imageUrl": "https://picsum.photos/seed/monitor1/300/200",
          "status": "Assigned"
        },
        "issueDate": "2026-02-15T14:30:00.000Z"
      }
    ]
  },
  {
    "id": 48,
    "name": "Sultana Razia",
    "designation": "প্রোগ্রামার",
    "department": "প্রশাসন শাখা",
    "phone": "01812345679",
    "email": "razia@example.gov.bd",
    "photoUrl": "https://picsum.photos/seed/officer2/200/200",
    "isActive": true,
    "createdAt": "2026-03-15T10:00:00.000Z",
    "assignments": [
      {
        "id": 3,
        "asset": {
          "id": 103,
          "assetTag": "TAB-012",
          "brand": "Samsung",
          "model": "Galaxy Tab S7",
          "category": "Tablet",
          "imageUrl": "https://picsum.photos/seed/tablet1/300/200",
          "status": "Assigned"
        },
        "issueDate": "2026-03-20T09:00:00.000Z"
      }
    ]
  }
];

export default function OfficerDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [officer, setOfficer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const found = mockOfficers.find(o => o.id === Number(id));
      setOfficer(found);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!officer) {
    return (
      <div className="text-center py-20">
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
        {/* Left Column: Officer Info Card */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface-container-lowest rounded-3xl border border-outline-variant overflow-hidden shadow-sm"
          >
            <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 relative">
              <div className="absolute -bottom-12 left-8 p-1 bg-surface-container-lowest rounded-3xl shadow-lg">
                <div className="w-24 h-24 rounded-2xl bg-primary-container overflow-hidden border-2 border-surface-container-lowest">
                  {officer.photoUrl ? (
                    <img src={officer.photoUrl} alt={officer.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-black text-primary">
                      {officer.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="pt-16 p-8 space-y-6">
              <div>
                <h2 className="text-xl font-black text-on-surface tracking-tight leading-tight">{officer.name}</h2>
                <p className="text-sm font-bold text-primary uppercase tracking-wider mt-1">{officer.designation}</p>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">{officer.department}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-outline-variant/50">
                <InfoItem icon="phone" label="ফোন" value={officer.phone} />
                <InfoItem icon="mail" label="ইমেইল" value={officer.email} />
                <InfoItem icon="calendar_today" label="যোগদানের তারিখ" value={new Date(officer.createdAt).toLocaleDateString('bn-BD')} />
                <div className="flex items-center justify-between py-2">
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">স্ট্যাটাস</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ring-1 ring-inset ${
                    officer.isActive ? 'bg-green-100 text-green-800 ring-green-600/20' : 'bg-surface-container-high text-on-surface-variant ring-outline-variant'
                  }`}>
                    {officer.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                  </span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/officers/edit/${officer.id}`)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-surface-container-high hover:bg-primary/10 text-on-surface-variant hover:text-primary rounded-2xl font-bold transition-all border border-outline-variant"
                >
                  <MaterialIcon name="edit" size={18} />
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
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Assigned Assets List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <MaterialIcon name="inventory_2" size={20} />
              </div>
              <h3 className="text-lg font-black text-on-surface tracking-tight">বরাদ্দকৃত সম্পদসমূহ ({officer.assignments?.length || 0})</h3>
            </div>
            <button 
              onClick={() => navigate('/assignments')}
              className="text-xs font-bold text-primary hover:underline"
            >
              সকল বরাদ্দ দেখুন
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {officer.assignments && officer.assignments.length > 0 ? (
              officer.assignments.map((assignment: any, index: number) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/inventory/${assignment.asset.id}`)}
                  className="bg-surface-container-lowest rounded-3xl border border-outline-variant p-5 flex gap-4 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-20 h-20 rounded-2xl bg-surface-container-low overflow-hidden flex-shrink-0 border border-outline-variant">
                    <img 
                      src={assignment.asset.imageUrl} 
                      alt={assignment.asset.model} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                        {assignment.asset.category}
                      </span>
                      <MaterialIcon name="arrow_forward" size={16} className="text-on-surface-variant/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <h4 className="font-black text-on-surface mt-1 truncate">{assignment.asset.brand} {assignment.asset.model}</h4>
                    <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Tag: {assignment.asset.assetTag}</p>
                    <div className="mt-3 flex items-center gap-1.5 text-[10px] font-medium text-on-surface-variant">
                      <MaterialIcon name="event" size={12} />
                      ইস্যু: {new Date(assignment.issueDate).toLocaleDateString('bn-BD')}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12 bg-surface-container-low/50 rounded-3xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-on-surface-variant">
                <MaterialIcon name="inventory" size={48} className="opacity-20 mb-2" />
                <p className="font-bold">এই অফিসারের নামে কোনো সম্পদ বরাদ্দ নেই</p>
                <button 
                  onClick={() => navigate('/assignments')}
                  className="mt-4 bg-primary text-on-primary px-6 py-2 rounded-full text-sm font-bold"
                >
                  নতুন সম্পদ বরাদ্দ দিন
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
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
