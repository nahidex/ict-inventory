import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MaterialIcon } from '../../components/atoms/Icons';
import { assetService } from '../../services/asset.service';
import { officerService } from '../../services/officer.service';
import maintenanceService from '../../services/maintenance.service';
import { Toast } from '../../components/atoms/Toast';

export default function RequestMaintenancePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' as 'success' | 'error' });
  
  // Data for Selects
  const [assets, setAssets] = useState<any[]>([]);
  const [officers, setOfficers] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    assetId: '',
    officerId: '',
    vendorName: '',
    sentDate: new Date().toISOString().split('T')[0],
    issueDescription: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [assetRes, officerRes] = await Promise.all([
          assetService.getAll(),
          officerService.getAll()
        ]);
        
        // Handle different response structures (if wrapped in data: [])
        const allAssets = Array.isArray(assetRes) ? assetRes : (assetRes.data || []);
        const allOfficers = Array.isArray(officerRes) ? officerRes : (officerRes.data || []);

        // Filter only Available or Assigned assets
        const linkableAssets = allAssets.filter((a: any) => 
          a.status === 'Available' || a.status === 'Assigned'
        );
        setAssets(linkableAssets);
        setOfficers(allOfficers);
      } catch (err) {
        console.error('Data loading failed', err);
        setToast({ isOpen: true, message: 'ডাটা লোড করতে সমস্যা হয়েছে।', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.assetId || !formData.issueDescription) {
      setToast({ isOpen: true, message: 'অ্যাসেট এবং সমস্যার বিবরণ প্রদান করা আবশ্যক।', type: 'error' });
      return;
    }

    try {
      setIsSubmitLoading(true);
      
      const payload = {
        assetId: parseInt(formData.assetId),
        officerId: formData.officerId ? parseInt(formData.officerId) : null,
        issueDescription: formData.issueDescription,
        startDate: formData.sentDate,
        vendorDetails: formData.vendorName
      };

      await maintenanceService.createRequest(payload);
      
      setToast({ isOpen: true, message: 'সফলভাবে মেরামত রিকোয়েস্ট তৈরি করা হয়েছে এবং অ্যাসেট স্ট্যাটাস আপডেট হয়েছে।', type: 'success' });
      setTimeout(() => navigate('/maintenance'), 1500);
    } catch (error: any) {
      console.error('Submission failed:', error);
      setToast({ 
        isOpen: true, 
        message: error.response?.data?.message || 'রিকোয়েস্ট পাঠাতে সমস্যা হয়েছে।', 
        type: 'error' 
      });
    } finally {
      setIsSubmitLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  const selectedAsset = assets.find(a => a.id.toString() === formData.assetId);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1, x: -4 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/maintenance')}
          className="w-12 h-12 flex items-center justify-center bg-transparent hover:bg-surface-container-high rounded-full text-primary transition-all group"
        >
          <MaterialIcon name="arrow_back" size={24} className="group-hover:-translate-x-1 transition-transform" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight font-sans">নতুন মেরামত রিকোয়েস্ট</h1>
          <p className="text-sm text-on-surface-variant font-medium">অ্যাসেট মেরামতে পাঠানোর জন্য নিচের ফর্মটি পূরণ করুন</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Asset Preview Card */}
          <div className="md:col-span-1 space-y-4">
            <div className="aspect-square w-full rounded-3xl border border-outline-variant bg-surface-container-low flex flex-col items-center justify-center overflow-hidden relative shadow-sm transition-all">
              {selectedAsset?.initialImageUrl ? (
                <img 
                  src={selectedAsset.initialImageUrl} 
                  alt="Asset" 
                  className="w-full h-full object-cover" 
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-secondary-container text-secondary gap-3">
                  <MaterialIcon name="devices" size={64} />
                  <span className="text-xs font-black uppercase tracking-widest opacity-50">অ্যাসেট প্রিভিউ</span>
                </div>
              )}
            </div>
            
            {selectedAsset && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant space-y-3 shadow-sm"
              >
                <div>
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest leading-none mb-1">অ্যাসেট ট্যাগ</p>
                  <p className="text-sm font-black text-primary">{selectedAsset.assetTag}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest leading-none mb-1">ব্র্যান্ড</p>
                    <p className="text-xs font-bold text-on-surface">{selectedAsset.brand || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest leading-none mb-1">ক্যাটাগরি</p>
                    <p className="text-xs font-bold text-on-surface">{selectedAsset.category?.name || 'N/A'}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/50 flex gap-3">
              <MaterialIcon name="info" className="text-amber-600 shrink-0" size={20} />
              <p className="text-[10px] text-amber-800 font-bold leading-relaxed uppercase tracking-tight">
                সাবমিট করার সাথে সাথে অ্যাসেটের স্ট্যাটাস <span className="underline italic">মেরামতাধীন</span> হয়ে যাবে এবং এটি বরাদ্দের অযোগ্য হবে।
              </p>
            </div>
          </div>

          {/* Right Column: Form Fields */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant space-y-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Asset Selection */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider">মেরামতের জন্য অ্যাসেট সিলেক্ট করুন *</label>
                  <div className="relative">
                    <MaterialIcon name="laptop_mac" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                    <select
                      required
                      name="assetId"
                      value={formData.assetId}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-10 py-3.5 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all appearance-none"
                    >
                      <option value="">অ্যাসেট নির্বাচন করুন</option>
                      {assets.map(asset => (
                        <option key={asset.id} value={asset.id}>{asset.assetTag} - {asset.category?.name} ({asset.brand})</option>
                      ))}
                    </select>
                    <MaterialIcon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" size={20} />
                  </div>
                </div>

                {/* Sent Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider">পাঠানোর তারিখ *</label>
                  <div className="relative">
                    <MaterialIcon name="calendar_today" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                    <input
                      required
                      type="date"
                      name="sentDate"
                      value={formData.sentDate}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Vendor Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider">মেরামতকারী / ভেন্ডর</label>
                  <div className="relative">
                    <MaterialIcon name="business" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                    <input
                      name="vendorName"
                      value={formData.vendorName}
                      onChange={handleInputChange}
                      placeholder="যেমন: ইউনিকম ট্রেডার্স"
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Officer Selection */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider">কার কাছ থেকে আসছে? (ঐচ্ছিক)</label>
                  <div className="relative">
                    <MaterialIcon name="person" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                    <select
                      name="officerId"
                      value={formData.officerId}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-10 py-3.5 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all appearance-none"
                    >
                      <option value="">কর্মকর্তা নির্বাচন করুন</option>
                      {officers.map(officer => (
                        <option key={officer.id} value={officer.id}>{officer.name} - {officer.designation}</option>
                      ))}
                    </select>
                    <MaterialIcon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" size={20} />
                  </div>
                </div>

                {/* Issue Description */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider">সমস্যার বিস্তারিত বিবরণ *</label>
                  <div className="relative group">
                    <MaterialIcon name="report_problem" className="absolute left-4 top-4 text-on-surface-variant" size={20} />
                    <textarea
                      required
                      name="issueDescription"
                      rows={4}
                      value={formData.issueDescription}
                      onChange={handleInputChange}
                      placeholder="যেমন: পাওয়ার অন হচ্ছে না, ডিসপ্লে তে সমস্যা ইত্যাদি..."
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                disabled={isSubmitLoading}
                onClick={() => navigate('/maintenance')}
                className="px-8 py-3 rounded-full font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50"
              >
                বাতিল করুন
              </button>
              <motion.button
                whileHover={{ scale: isSubmitLoading ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitLoading ? 1 : 0.98 }}
                type="submit"
                disabled={isSubmitLoading}
                className="px-10 py-3 bg-primary text-on-primary rounded-full font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <MaterialIcon name="send" size={20} />
                )}
                {isSubmitLoading ? 'পাঠানো হচ্ছে...' : 'রিকোয়েস্ট সাবমিট করুন'}
              </motion.button>
            </div>
          </div>
        </div>
      </form>

      <Toast 
        isOpen={toast.isOpen} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, isOpen: false })} 
      />
    </div>
  );
}
