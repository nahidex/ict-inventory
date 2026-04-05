import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MaterialIcon } from '../../components/atoms/Icons';
import maintenanceService from '../../services/maintenance.service';
import Avatar from '../../components/atoms/Avatar';

const ReceiveFromMaintenancePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [record, setRecord] = useState<any>(null);

  const [formData, setFormData] = useState({
    receive_date: new Date().toISOString().split('T')[0],
    repair_cost: 0,
    repair_status: 'Completed',
    return_to_officer: true,
    note: ''
  });

  useEffect(() => {
    fetchRecord();
  }, [id]);

  const fetchRecord = async () => {
    try {
      if (!id) return;
      setLoading(true);
      const data = await maintenanceService.getById(parseInt(id));
      setRecord(data);
    } catch (error) {
      console.error('Fetch error:', error);
      alert('রেকর্ড লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!id) return;
      setSubmitting(true);
      await maintenanceService.complete(parseInt(id), formData);
      navigate('/maintenance');
    } catch (error) {
      console.error('Submit error:', error);
      alert('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!record) return <div>রেকর্ড পাওয়া যায়নি</div>;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-on-surface">মেরামত রিসিভ করুন</h1>
          <p className="text-on-surface-variant text-sm mt-1">ডিভাইসটি মেরামত থেকে ফিরে আসলে তথ্যগুলো আপডেট করুন</p>
        </div>
        <button 
          onClick={() => navigate('/maintenance')}
          className="w-10 h-10 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant flex items-center justify-center border border-outline-variant"
        >
          <MaterialIcon name="close" size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Asset Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant">
            <h3 className="text-xs font-black text-primary uppercase tracking-tighter mb-4 flex items-center gap-2">
              <MaterialIcon name="laptop" size={16} />
              ডিভাইসের তথ্য
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase">ট্যাগ আইডি</p>
                <p className="text-sm font-black text-on-surface">{record.assets?.assetTag}</p>
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase">ব্র্যান্ড ও মডেল</p>
                <p className="text-sm font-bold text-on-surface">{record.assets?.brand} {record.assets?.model}</p>
              </div>
              <div className="pt-4 border-t border-outline-variant/50">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase mb-2">প্রেরক অফিসার</p>
                <div className="flex items-center gap-2">
                  <Avatar src={record.officers?.photoUrl} name={record.officers?.name || ''} size="sm" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-on-surface truncate">{record.officers?.name}</p>
                    <p className="text-[9px] text-on-surface-variant font-medium">{record.officers?.designation}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Update Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-on-surface-variant ml-1 uppercase">রিসিভ ডেট</label>
                <input 
                  type="date" 
                  required
                  value={formData.receive_date}
                  onChange={(e) => setFormData({...formData, receive_date: e.target.value})}
                  className="w-full h-12 bg-surface-container-high border border-outline-variant rounded-2xl px-4 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-on-surface-variant ml-1 uppercase">মেরামত খরচ (৳)</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  value={formData.repair_cost}
                  onChange={(e) => setFormData({...formData, repair_cost: parseFloat(e.target.value)})}
                  className="w-full h-12 bg-surface-container-high border border-outline-variant rounded-2xl px-4 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm"
                />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-xs font-black text-on-surface-variant ml-1 uppercase">মেরামত স্ট্যাটাস</label>
              <div className="flex flex-wrap gap-3">
                {['Completed', 'Unrepairable'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFormData({...formData, repair_status: status})}
                    className={`px-6 py-2 rounded-xl text-xs font-black transition-all border ${
                      formData.repair_status === status 
                        ? 'bg-primary text-on-primary border-primary' 
                        : 'bg-surface-container-high text-on-surface-variant border-outline-variant hover:border-primary/50'
                    }`}
                  >
                    {status === 'Completed' ? 'সফলভাবে সম্পন্ন' : 'অযোগ্য/না-মেরামতযোগ্য'}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-primary-container/30 rounded-2xl p-6 border border-primary/10 mb-6 font-medium">
              <p className="text-xs font-black text-primary mb-3 uppercase tracking-tighter">পরবর্তী পদক্ষেপ (Next Level Decision)</p>
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="pt-1">
                    <input 
                      type="radio" 
                      name="decision"
                      checked={formData.return_to_officer === true}
                      onChange={() => setFormData({...formData, return_to_officer: true})}
                      className="w-4 h-4 text-primary focus:ring-primary ring-offset-bg transition-all"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">পূর্বের অফিসারের কাছেই ফিরে যাবে</p>
                    <p className="text-[10px] text-on-surface-variant">ডিভাইসটি স্বয়ংক্রিয়ভাবে <span className="text-primary font-bold">ASSIGNED</span> স্ট্যাটাসে থাকবে</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group pt-3 border-t border-primary/10">
                  <div className="pt-1">
                    <input 
                      type="radio" 
                      name="decision"
                      checked={formData.return_to_officer === false}
                      onChange={() => setFormData({...formData, return_to_officer: false})}
                      className="w-4 h-4 text-primary focus:ring-primary ring-offset-bg transition-all"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">স্টোরে জমা হবে (অফিসার ফেরত দিয়েছেন)</p>
                    <p className="text-[10px] text-on-surface-variant">ডিভাইসটি <span className="text-primary font-bold">AVAILABLE</span> হবে এবং অফিসার থেকে রিমুভ হবে</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <label className="text-xs font-black text-on-surface-variant ml-1 uppercase">নোট (ঐচ্ছিক)</label>
              <textarea 
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
                placeholder="মেইনটেন্যান্স সম্পর্কে কোনো মন্তব্য থাকলে লিখুন..."
                className="w-full h-24 bg-surface-container-high border border-outline-variant rounded-2xl p-4 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm resize-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/maintenance')}
                className="flex-1 h-12 rounded-2xl bg-surface-container-highest text-on-surface font-black text-xs uppercase tracking-widest hover:bg-outline-variant transition-colors"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-[2] h-12 bg-primary text-on-primary rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-on-primary/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <MaterialIcon name="check_circle" size={18} />
                    সংরক্ষণ করুন
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReceiveFromMaintenancePage;
