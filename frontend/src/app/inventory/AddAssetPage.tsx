import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MaterialIcon } from '../../components/atoms/Icons';

export default function AddAssetPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    assetTag: '',
    categoryId: '',
    brand: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    purchaseSource: '',
    status: 'Available',
    description: ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // In a real app, this would be an API call
    alert('এসেট সফলভাবে যোগ করা হয়েছে!');
    navigate('/inventory');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
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
          <h1 className="text-2xl font-black text-primary tracking-tight font-sans">নতুন এসেট যোগ করুন</h1>
          <p className="text-sm text-on-surface-variant font-medium">সিস্টেমে নতুন একটি এসেট নিবন্ধিত করুন</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Image Upload */}
          <div className="md:col-span-1 space-y-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square w-full rounded-3xl border-2 border-dashed border-outline-variant bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer flex flex-col items-center justify-center overflow-hidden relative group"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <MaterialIcon name="photo_camera" className="text-white" size={32} />
                  </div>
                </>
              ) : (
                <div className="text-center p-6 space-y-2">
                  <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center mx-auto text-primary">
                    <MaterialIcon name="add_a_photo" size={32} />
                  </div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">ছবি আপলোড করুন</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*" 
              />
            </div>
            <p className="text-[10px] text-center text-on-surface-variant font-medium">
              সমর্থিত ফরম্যাট: JPG, PNG, WebP (সর্বোচ্চ ৫ মেগাবাইট)
            </p>
          </div>

          {/* Right Column: Form Fields */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Asset Tag */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1">এসেট ট্যাগ (Asset Tag) *</label>
                  <input
                    required
                    name="assetTag"
                    value={formData.assetTag}
                    onChange={handleInputChange}
                    placeholder="যেমন: LAP-2024-001"
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1">ক্যাটাগরি *</label>
                  <select
                    required
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat"
                  >
                    <option value="">ক্যাটাগরি নির্বাচন করুন</option>
                    <option value="1">ল্যাপটপ</option>
                    <option value="2">প্রিন্টার</option>
                    <option value="3">মনিটর</option>
                    <option value="4">নেটওয়ার্ক ডিভাইস</option>
                  </select>
                </div>

                {/* Brand */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1">ব্র্যান্ড (Brand) *</label>
                  <input
                    required
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="যেমন: HP, Dell, Apple"
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
                  />
                </div>

                {/* Model */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1">মডেল (Model) *</label>
                  <input
                    required
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="যেমন: LaserJet Pro, MacBook Air"
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
                  />
                </div>

                {/* Serial Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1">সিরিয়াল নম্বর *</label>
                  <input
                    required
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleInputChange}
                    placeholder="SN-XXXXX-XXXXX"
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono font-bold transition-all"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1">অবস্থা (Status) *</label>
                  <select
                    required
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat"
                  >
                    <option value="Available">উপলব্ধ (Available)</option>
                    <option value="Assigned">বরাদ্দকৃত (Assigned)</option>
                    <option value="In Repair">মেরামতে (In Repair)</option>
                  </select>
                </div>

                {/* Purchase Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1">ক্রয়ের তারিখ *</label>
                  <input
                    required
                    type="date"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
                  />
                </div>

                {/* Purchase Source */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1">ক্রয়ের উৎস *</label>
                  <input
                    required
                    name="purchaseSource"
                    value={formData.purchaseSource}
                    onChange={handleInputChange}
                    placeholder="যেমন: রাজস্ব বাজেট, আইসিটি প্রকল্প"
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant ml-1">বর্ণনা (ঐচ্ছিক)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="এসেট সম্পর্কে অতিরিক্ত তথ্য..."
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/inventory')}
                className="px-8 py-3 rounded-full font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                বাতিল করুন
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-10 py-3 bg-primary text-on-primary rounded-full font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
              >
                <MaterialIcon name="save" size={20} />
                এসেট সংরক্ষণ করুন
              </motion.button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
