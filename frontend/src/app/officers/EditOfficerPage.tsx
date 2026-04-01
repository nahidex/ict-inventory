import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { MaterialIcon } from '../../components/atoms/Icons';

// Mock data for initial load in edit mode
const mockOfficers = [
  {
    id: 47,
    name: "Recipient Officer",
    designation: "সিনিয়র সিস্টেম অ্যানালিস্ট",
    department: "আইসিটি শাখা",
    phone: "01712345678",
    email: "officer@example.gov.bd",
    photoUrl: "https://picsum.photos/seed/officer1/100/100",
    isActive: true
  },
  {
    id: 48,
    name: "Sultana Razia",
    designation: "প্রোগ্রামার",
    department: "প্রশাসন শাখা",
    phone: "01812345679",
    email: "razia@example.gov.bd",
    photoUrl: "https://picsum.photos/seed/officer2/100/100",
    isActive: true
  }
];

export default function EditOfficerPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: '',
    phone: '',
    email: '',
    photoUrl: '',
    isActive: true
  });

  const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  useEffect(() => {
    // Simulate fetching officer data
    const officer = mockOfficers.find(o => o.id === Number(id));
    if (officer) {
      setFormData({
        name: officer.name,
        designation: officer.designation,
        department: officer.department,
        phone: officer.phone,
        email: officer.email,
        photoUrl: officer.photoUrl || '',
        isActive: officer.isActive
      });
    }
  }, [id]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Updated Officer Data:', formData);
    alert('অফিসারের তথ্য সফলভাবে আপডেট করা হয়েছে!');
    navigate('/officers');
  };

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
          <h1 className="text-2xl font-black text-primary tracking-tight font-sans">অফিসার তথ্য এডিট করুন</h1>
          <p className="text-sm text-on-surface-variant font-medium">বিদ্যমান কর্মকর্তার তথ্য পরিবর্তন করুন</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Image Preview */}
          <div className="md:col-span-1 space-y-4">
            <div className="aspect-square w-full rounded-3xl border-2 border-dashed border-outline-variant bg-surface-container-low flex flex-col items-center justify-center overflow-hidden relative group shadow-sm">
              <div className="w-full h-full flex items-center justify-center bg-primary-container text-primary font-black text-4xl">
                {formData.photoUrl ? (
                  <img 
                    src={formData.photoUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  getInitials(formData.name) || <MaterialIcon name="person" size={64} />
                )}
              </div>
            </div>
            <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant space-y-3">
              <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider">ছবির ইউআরএল</label>
              <div className="relative">
                <MaterialIcon name="link" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                <input
                  name="photoUrl"
                  value={formData.photoUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                />
              </div>
              <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed">
                অনলাইন থেকে ছবির লিঙ্ক কপি করে এখানে পেস্ট করুন। ছবি না থাকলে নামের আদ্যক্ষর ব্যবহার করা হবে।
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
                <div className="space-y-1.5">
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

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider">বিভাগ/শাখা *</label>
                  <div className="relative">
                    <MaterialIcon name="corporate_fare" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                    <input
                      required
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="যেমন: আইসিটি শাখা"
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
                <MaterialIcon name="save" size={20} />
                পরিবর্তন সংরক্ষণ করুন
              </motion.button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
