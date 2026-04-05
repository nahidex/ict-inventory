import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { MaterialIcon } from '../../components/atoms/Icons';
import { assignmentService } from '../../services/assignment.service';

export default function ReturnAssetPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [condition, setCondition] = useState('Good');
  const [comments, setComments] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await assignmentService.getById(id);
        setAssignment(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching assignment:', err);
        setError('বরাদ্দ তথ্য লোড করা সম্ভব হয়নি।');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      const formData = new FormData();
      formData.append('actualReturnDate', returnDate);
      formData.append('returnCondition', condition);
      formData.append('comments', comments);
      if (image) {
        formData.append('returnImage', image);
      }

      await assignmentService.return(id, formData);
      alert('এসেট ফেরত সফলভাবে সম্পন্ন হয়েছে!');
      navigate(`/assignments/${id}`);
    } catch (err: any) {
      console.error('Error returning asset:', err);
      alert('এসেট ফেরত দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="text-center py-20">
        <div className="text-error font-bold mb-4">{error || 'বরাদ্দ তথ্য পাওয়া যায়নি!'}</div>
        <button onClick={() => navigate('/assignments')} className="btn btn-primary">ফিরে যান</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1, x: -4 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-12 h-12 flex items-center justify-center bg-transparent hover:bg-surface-container-high rounded-full text-primary transition-all group"
        >
          <MaterialIcon name="arrow_back" size={24} className="group-hover:-translate-x-1 transition-transform" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight font-sans">এসেট ফেরত গ্রহণ</h1>
          <p className="text-sm text-on-surface-variant font-medium">বরাদ্দ আইডি: #{assignment.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Info Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Asset Summary */}
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex items-center gap-2">
              <MaterialIcon name="devices" className="text-primary" size={20} />
              <h2 className="font-bold text-on-surface uppercase tracking-wider text-xs">এসেট তথ্য</h2>
            </div>
            <div className="p-6 space-y-4">
              {assignment.asset?.initialImageUrl && (
                <div className="aspect-video rounded-2xl bg-surface-container-high overflow-hidden border border-outline-variant">
                  <img src={assignment.asset.initialImageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
              <div className="space-y-3">
                <InfoRow label="এসেট ট্যাগ" value={assignment.asset?.assetTag || '---'} highlight />
                <InfoRow label="মডেল" value={`${assignment.asset?.brand || ''} ${assignment.asset?.model || ''}`.trim() || '---'} />
                <InfoRow label="সিরিয়াল" value={assignment.asset?.serialNumber || '---'} />
              </div>
            </div>
          </div>

          {/* Officer Summary */}
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex items-center gap-2">
              <MaterialIcon name="person" className="text-primary" size={20} />
              <h2 className="font-bold text-on-surface uppercase tracking-wider text-xs">অফিসার তথ্য</h2>
            </div>
            <div className="p-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-container overflow-hidden flex-shrink-0">
                {assignment.officer?.photoUrl ? (
                  <img src={assignment.officer.photoUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-on-primary font-black text-xl">
                    {assignment.officer?.name?.charAt(0) || '?'}
                  </div>
                )}
              </div>
              <div>
                <p className="font-black text-primary">{assignment.officer?.name || 'অজানা অফিসার'}</p>
                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-tight">{assignment.officer?.designation || 'পদবী উল্লেখ নেই'}</p>
                <p className="text-[10px] text-on-surface-variant font-medium">{assignment.officer?.department || ''}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Return Form */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-3xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="bg-surface-container-low px-8 py-5 border-b border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MaterialIcon name="assignment_return" className="text-primary" size={24} />
                <h2 className="font-black text-on-surface tracking-tight">রিটার্ন ফর্ম পূরণ করুন</h2>
              </div>
              <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest">Required</span>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Return Date */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <MaterialIcon name="calendar_today" size={16} />
                    ফেরতের তারিখ
                  </label>
                  <input 
                    type="date" 
                    required
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-surface-container-high border border-outline-variant rounded-2xl px-5 py-3.5 font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                {/* Return Condition */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <MaterialIcon name="verified" size={16} />
                    ডিভাইসের অবস্থা
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {['Good', 'Fair', 'Poor', 'Damaged'].map((opt) => (
                      <label 
                        key={opt}
                        className={`flex-1 min-w-[80px] cursor-pointer flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                          condition === opt 
                            ? 'bg-primary/5 border-primary text-primary' 
                            : 'bg-surface-container-low border-outline-variant text-on-surface-variant hover:border-primary/30'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="condition" 
                          value={opt} 
                          checked={condition === opt}
                          onChange={(e) => setCondition(e.target.value)}
                          className="hidden"
                        />
                        <MaterialIcon name={
                          opt === 'Good' ? 'check_circle' : 
                          opt === 'Fair' ? 'info' : 
                          opt === 'Poor' ? 'warning' : 'report'
                        } size={20} />
                        <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">{
                          opt === 'Good' ? 'ভালো' : 
                          opt === 'Fair' ? 'চলনসই' : 
                          opt === 'Poor' ? 'খারাপ' : 'ক্ষতিগ্রস্ত'
                        }</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-2">
                <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                  <MaterialIcon name="notes" size={16} />
                  মন্তব্য (যদি থাকে)
                </label>
                <textarea 
                  rows={4}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="ডিভাইসের অবস্থা সম্পর্কে বিস্তারিত লিখুন..."
                  className="w-full bg-surface-container-high border border-outline-variant rounded-2xl px-5 py-4 font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <label className="text-xs font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                  <MaterialIcon name="add_a_photo" size={16} />
                  ডিভাইসের ছবি (রিটার্ন সময়কাল)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div 
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="border-2 border-dashed border-outline-variant rounded-3xl p-8 flex flex-col items-center justify-center gap-3 bg-surface-container-low hover:bg-surface-container-high hover:border-primary/50 cursor-pointer transition-all group"
                  >
                    <input 
                      id="image-upload"
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MaterialIcon name="upload" size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-on-surface">ছবি আপলোড করুন</p>
                      <p className="text-[10px] text-on-surface-variant font-medium">PNG, JPG (Max 5MB)</p>
                    </div>
                  </div>

                  {imagePreview ? (
                    <div className="relative aspect-video md:aspect-auto rounded-3xl overflow-hidden border border-outline-variant group">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => { setImage(null); setImagePreview(null); }}
                        className="absolute top-3 right-3 w-8 h-8 bg-error text-on-error rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MaterialIcon name="close" size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="aspect-video md:aspect-auto rounded-3xl bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface-variant/30 italic text-xs font-medium">
                      কোনো ছবি নির্বাচন করা হয়নি
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full bg-primary text-on-primary py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:bg-primary/90 transition-all"
                >
                  <MaterialIcon name="task_alt" size={24} />
                  ফেরত সম্পন্ন করুন
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-outline-variant/50 last:border-0">
      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</span>
      <span className={`text-sm font-bold ${highlight ? 'text-primary' : 'text-on-surface'}`}>{value}</span>
    </div>
  );
}
