import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MaterialIcon } from '../../components/atoms/Icons';
import { Badge } from '../../components/atoms/Badge';
import { assetService, Asset } from '../../services/asset.service';

export default function AssetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsset = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await assetService.getById(id);
        setAsset(data);
      } catch (error) {
        console.error('Failed to fetch asset details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAsset();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-[5px] border-primary/10 border-t-primary rounded-full animate-spin"></div>
        <span className="text-[14px] font-bold text-primary animate-pulse tracking-tight uppercase">লোড হচ্ছে...</span>
      </div>
    );
  }

  // Use asset date or fallback to null/undefined if data missing
  const currentOfficer = asset?.assignments?.find(a => !a.actualReturnDate)?.officer;

  return (
    <div className="space-y-6">
      {/* Back Button and Title */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1, x: -4 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/inventory')}
          className="w-12 h-12 flex items-center justify-center bg-transparent hover:bg-surface-container-high rounded-full text-primary transition-all group"
        >
          <MaterialIcon name="arrow_back" size={24} className="group-hover:-translate-x-1 transition-transform" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight font-sans">সম্পদ বিস্তারিত</h1>
          <p className="text-sm text-on-surface-variant font-medium">সম্পদ আইডি: {asset?.assetTag || 'N/A'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Asset Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-lowest rounded-3xl border border-outline-variant overflow-hidden"
          >
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Image Section */}
                <div className="w-full md:w-64 h-64 rounded-2xl bg-surface-container-high overflow-hidden border border-outline-variant flex-shrink-0 flex items-center justify-center">
                  {asset?.imageUrl || asset?.initialImageUrl ? (
                    <img 
                      src={asset.imageUrl || asset.initialImageUrl || ''} 
                      alt={asset?.model || ''} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <MaterialIcon name="devices" size={64} className="text-on-surface-variant/20" />
                  )}
                </div>

                {/* Title & Status Section */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-flex px-3 py-1 rounded-lg bg-secondary-container text-on-secondary-container text-[11px] font-black uppercase tracking-wider mb-2 border border-on-secondary-container/10">
                        {asset?.category?.name || 'Uncategorized'}
                      </span>
                      <h2 className="text-3xl font-black text-on-surface leading-tight">
                        {asset?.brand} {asset?.model}
                      </h2>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {asset?.status === 'Available' && <Badge label="উপলব্ধ" variant="primary" showDot />}
                      {asset?.status === 'Assigned' && <Badge label="বরাদ্দ" variant="success" showDot />}
                      {asset?.status === 'Under_Repair' && <Badge label="মেরামতে" variant="warning" showDot />}
                      {asset?.status === 'Disposed' && <Badge label="অকেজো" variant="error" showDot />}
                    </div>
                  </div>

                  <p className="text-on-surface-variant leading-relaxed font-medium">
                    {/* Placeholder description if not in API yet */}
                    এই {asset?.category?.name || 'ডিভাইস'} টি {asset?.purchaseSource} বাজেট থেকে কেনা হয়েছে।
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant">
                    <div>
                      <p className="text-[11px] font-black text-on-surface-variant/50 uppercase tracking-widest mb-1">সিরিয়াল নম্বর</p>
                      <p className="font-bold text-on-surface">{asset?.serialNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-on-surface-variant/50 uppercase tracking-widest mb-1">ক্রয়ের তারিখ</p>
                      <p className="font-bold text-on-surface">
                        {asset?.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString('en-GB') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Specifications Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-container-lowest rounded-3xl border border-outline-variant p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <MaterialIcon name="list_alt" size={24} />
              </div>
              <h3 className="text-xl font-black text-on-surface tracking-tight">টেকনিক্যাল স্পেসিফিকেশন</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* If API is expanded to include specs, map them here. For now show N/A or empty placeholders to keep design */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
                <p className="text-[11px] font-black text-on-surface-variant/50 uppercase tracking-widest mb-1">সোর্স</p>
                <p className="font-bold text-on-surface">{asset?.purchaseSource || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
                <p className="text-[11px] font-black text-on-surface-variant/50 uppercase tracking-widest mb-1">লোকেশন</p>
                <p className="font-bold text-on-surface">{asset?.locationDetails || 'N/A'}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Primary Officer & History */}
        <div className="space-y-6">
          {/* Current User Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-primary text-on-primary rounded-3xl p-8 shadow-lg shadow-primary/20 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all"></div>
            
            <div className="relative z-10">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-70 mb-6">বর্তমানে যার কাছে আছে</p>
              {currentOfficer ? (
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-on-primary text-primary flex items-center justify-center text-xl font-black shadow-inner">
                    {currentOfficer.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xl font-black leading-tight mb-0.5">{currentOfficer.name}</h4>
                    <p className="text-sm font-bold opacity-70 italic">{currentOfficer.designation}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 py-4 opacity-50 italic">
                  <MaterialIcon name="person_off" size={32} />
                  <p className="font-bold">বর্তমানে কারো কাছে বরাদ্দ নেই</p>
                </div>
              )}
              
              {currentOfficer && (
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-sm font-bold bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
                    <MaterialIcon name="call" size={18} />
                    {currentOfficer.phone || 'ফোন নেই'}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10 overflow-hidden text-ellipsis">
                    <MaterialIcon name="mail" size={18} />
                    {currentOfficer.email || 'ইমেইল নেই'}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* History / Timeline */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface-container-lowest rounded-3xl border border-outline-variant p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-on-surface tracking-tight">অ্যাক্টিভিটি হিস্ট্রি</h3>
              <MaterialIcon name="history" size={24} className="text-primary" />
            </div>
            
            <div className="space-y-6">
              {asset?.activityLogs && asset.activityLogs.length > 0 ? (
                asset.activityLogs.map((log: any, idx) => (
                  <div key={log.id} className="relative pl-8 pb-2">
                    {/* Timeline Line */}
                    {idx !== asset.activityLogs.length - 1 && (
                      <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-outline-variant/30"></div>
                    )}
                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-surface-container-high border-2 border-outline-variant flex items-center justify-center z-10 group-hover:border-primary transition-colors">
                      <div className={`w-2 h-2 rounded-full ${log.actionType === 'REGISTRATION' ? 'bg-primary' : log.actionType === 'ASSIGNMENT' ? 'bg-success' : 'bg-warning'}`}></div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-black text-on-surface-variant/40 mb-1 uppercase tracking-wider">
                        {new Date(log.performedAt).toLocaleDateString('en-GB')}
                      </p>
                      <h5 className="text-[15px] font-black text-on-surface leading-snug">{log.description}</h5>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 opacity-30">
                  <MaterialIcon name="event_note" size={48} className="mx-auto mb-2" />
                  <p className="font-bold text-sm">কোনো হিস্ট্রি পাওয়া যায়নি</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
