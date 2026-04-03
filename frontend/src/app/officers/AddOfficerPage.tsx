import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { MaterialIcon } from '../../components/atoms/Icons';
import { officerService } from '../../services/officer.service';
import { branchService, Branch } from '../../services/branch.service';
import { Toast } from '../../components/atoms/Toast';

export default function AddOfficerPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: '',
    phone: '',
    email: '',
    photoUrl: '',
    branchId: '',
    isActive: true
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' as 'success' | 'error' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isEditMode) {
          setIsLoading(true);
        }
        
        // Always fetch branches
        const branchesData = await branchService.getAll();
        setBranches(branchesData);

        // Fetch officer data if in edit mode
        if (isEditMode) {
          const officerData = await officerService.getById(id!);
          setFormData({
            name: officerData.name,
            designation: officerData.designation,
            department: officerData.department,
            phone: officerData.phone,
            email: officerData.email,
            photoUrl: officerData.photoUrl || '',
            branchId: officerData.branchId || '',
            isActive: officerData.isActive
          });
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      // Create preview for UI
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setFormData(prev => ({ ...prev, photoUrl: '' }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        // Skip photoUrl if we are uploading a file to avoid confusion, 
        // unless we want to send it as fallback string
        if (key === 'photoUrl' && photoFile) return; 
        data.append(key, value.toString());
      });
      
      if (photoFile) {
        data.append('photo', photoFile);
      }

      if (isEditMode) {
        await officerService.update(id!, data);
        setToast({ isOpen: true, message: 'অফিসারের তথ্য সফলভাবে আপডেট করা হয়েছে!', type: 'success' });
      } else {
        await officerService.create(data);
        setToast({ isOpen: true, message: 'অফিসার সফলভাবে যোগ করা হয়েছে!', type: 'success' });
      }
      setTimeout(() => navigate('/officers'), 1500);
    } catch (error) {
      console.error('Failed to save officer:', error);
      setToast({ isOpen: true, message: 'তথ্য সংরক্ষণ করতে সমস্যা হয়েছে।', type: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
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
          <h1 className="text-2xl font-black text-primary tracking-tight font-sans">
            {isEditMode ? 'অফিসার তথ্য এডিট করুন' : 'নতুন অফিসার যোগ করুন'}
          </h1>
          <p className="text-sm text-on-surface-variant font-medium">
            {isEditMode ? 'বিদ্যমান কর্মকর্তার তথ্য পরিবর্তন করুন' : 'সিস্টেমে নতুন একজন কর্মকর্তার তথ্য নিবন্ধিত করুন'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Image Preview */}
          <div className="md:col-span-1 space-y-4">
            <div className="aspect-square w-full rounded-3xl border-2 border-dashed border-outline-variant bg-surface-container-low flex flex-col items-center justify-center overflow-hidden relative group shadow-sm transition-all hover:border-primary/50">
              <div className="w-full h-full flex items-center justify-center bg-primary-container text-primary font-black text-4xl">
                {formData.photoUrl ? (
                  <img 
                    src={formData.photoUrl.startsWith('data:') ? formData.photoUrl : (formData.photoUrl.startsWith('http') ? formData.photoUrl : `http://localhost:5000${formData.photoUrl}`)} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  getInitials(formData.name) || <MaterialIcon name="person" size={64} />
                )}
              </div>
              
              {/* Overlay for file upload */}
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white gap-2 backdrop-blur-[2px]">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <MaterialIcon name="photo_camera" size={24} />
                </div>
                <span className="text-xs font-bold">ছবি আপলোড করুন</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </label>
            </div>
            
            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">অথবা ছবির ইউআরএল</label>
                  {photoFile && (
                    <button 
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-[10px] font-bold text-error hover:underline flex items-center gap-1"
                    >
                      <MaterialIcon name="cancel" size={12} />
                      আপলোড বাতিল
                    </button>
                  )}
                </div>
                <div className="relative">
                  <MaterialIcon name="link" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                  <input
                    name="photoUrl"
                    value={formData.photoUrl.startsWith('data:') ? '' : formData.photoUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all font-medium"
                  />
                </div>
              </div>
              <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed px-1">
                সরাসরি পিসি থেকে ছবি আপলোড করতে উপরের বক্সে ক্লিক করুন অথবা ছবির অনলাইন লিংক এখানে দিন।
              </p>
            </div>
          </div>

          {/* Right Column: Form Fields */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant space-y-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider">কর্মকর্তার পূর্ণ নাম *</label>
                  <div className="relative">
                    <MaterialIcon name="person" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="যেমন: মোঃ আব্দুল করিম"
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Designation */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider">পদবি *</label>
                  <div className="relative">
                    <MaterialIcon name="badge" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                    <input
                      required
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="যেমন: সিনিয়র সিস্টেম অ্যানালিস্ট"
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider">ফোন নম্বর *</label>
                  <div className="relative">
                    <MaterialIcon name="call" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="01XXXXXXXXX"
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider">ইমেইল ঠিকানা *</label>
                  <div className="relative">
                    <MaterialIcon name="alternate_email" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@gov.bd"
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Branch Selection */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider">ব্রাঞ্চ/শাখা *</label>
                  <div className="relative">
                    <MaterialIcon name="domain" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                    <select
                      required
                      name="branchId"
                      value={formData.branchId}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-10 py-3.5 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all appearance-none"
                    >
                      <option value="">ব্রাঞ্চ সিলেক্ট করুন</option>
                      {branches.map(branch => (
                        <option key={branch.id} value={branch.id}>{branch.name} ({branch.code})</option>
                      ))}
                    </select>
                    <MaterialIcon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" size={20} />
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="md:col-span-2 flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-outline-variant">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.isActive ? 'bg-green-100 text-green-600' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      <MaterialIcon name={formData.isActive ? "check_circle" : "cancel"} size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">অফিসার স্ট্যাটাস</p>
                      <p className="text-xs text-on-surface-variant font-medium">বর্তমানে অফিসার সক্রিয় আছেন কি না</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="sr-only peer" 
                    />
                    <div className="w-14 h-7 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/officers')}
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
                <MaterialIcon name={isEditMode ? "save" : "person_add"} size={20} />
                {isEditMode ? 'তথ্য আপডেট করুন' : 'অফিসার সংরক্ষণ করুন'}
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
