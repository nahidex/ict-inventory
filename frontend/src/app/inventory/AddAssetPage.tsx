import { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MaterialIcon } from '../../components/atoms/Icons';
import { assetService } from '../../services/asset.service';
import { categoryService, Category } from '../../services/category.service';
import { branchService, Branch } from '../../services/branch.service';

export default function AddAssetPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    assetTag: '',
    categoryId: '',
    branchId: '',
    brand: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    purchaseSource: 'Budget',
    status: 'Available',
    description: ''
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesData, branchesData] = await Promise.all([
          categoryService.getAll(),
          branchService.getAll()
        ]);
        setCategories(categoriesData);
        setBranches(branchesData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchInitialData();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          data.append(key, value.toString());
        }
      });
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      await assetService.create(data);
      // Removed alert as per request for consistency
      navigate('/inventory');
    } catch (error: any) {
      console.error('Error creating asset:', error);
      // Keeping original error handling for now but could be improved
      alert(error.response?.data?.message || 'এসেট যোগ করা সম্ভব হয়নি।');
    } finally {
      setLoading(false);
    }
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

            {/* Quick Info Chips */}
            <div className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant space-y-4 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 ml-1">তথ্য প্রিভিউ (Live Preview)</h4>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-secondary-container/30 text-secondary rounded-xl border border-secondary/10">
                  <MaterialIcon name="tag" size={16} />
                  <span className="text-[11px] font-bold">{formData.assetTag || 'অ্যাসেট ট্যাগ'}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-primary-container/30 text-primary rounded-xl border border-primary/10">
                  <MaterialIcon name="category" size={16} />
                  <span className="text-[11px] font-bold">
                    {categories.find(c => String(c.id) === String(formData.categoryId))?.name || 'ক্যাটাগরি'}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-tertiary-container/30 text-tertiary rounded-xl border border-tertiary/10">
                  <MaterialIcon name="location_on" size={16} />
                  <span className="text-[11px] font-bold">
                    {branches.find(b => String(b.id) === String(formData.branchId))?.name || 'ব্রাঞ্চ'}
                  </span>
                </div>
                {formData.brand && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-high text-on-surface rounded-xl border border-outline-variant">
                    <MaterialIcon name="branding_watermark" size={16} />
                    <span className="text-[11px] font-bold">{formData.brand}</span>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-on-surface-variant/40 font-medium leading-relaxed px-1">
                আপনার দেওয়া ইনপুট অনুযায়ী এই চিপসগুলো রিয়েল-টাইমে আপডেট হচ্ছে।
              </p>
            </div>

            <p className="text-[10px] text-center text-on-surface-variant font-medium">
              সমর্থিত ফরম্যাট: JPG, PNG, WebP (সর্বোচ্চ ১০ মেগাবাইট)
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
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Branch */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1">ব্রাঞ্চ (Branch) *</label>
                  <select
                    required
                    name="branchId"
                    value={formData.branchId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat"
                  >
                    <option value="">ব্রাঞ্চ নির্বাচন করুন</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
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
                  <select
                    required
                    name="purchaseSource"
                    value={formData.purchaseSource}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat"
                  >
                    <option value="">উৎস নির্বাচন করুন</option>
                    <option value="Planning">Planning</option>
                    <option value="Development">Development</option>
                    <option value="Budget_2">Budget-2</option>
                  </select>
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
                disabled={loading}
                onClick={() => navigate('/inventory')}
                className="px-8 py-3 rounded-full font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50"
              >
                বাতিল করুন
              </button>
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                type="submit"
                disabled={loading}
                className="px-10 py-3 bg-primary text-on-primary rounded-full font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <MaterialIcon name="save" size={20} />
                )}
                {loading ? 'সংরক্ষণ করা হচ্ছে...' : 'এসেট সংরক্ষণ করুন'}
              </motion.button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
