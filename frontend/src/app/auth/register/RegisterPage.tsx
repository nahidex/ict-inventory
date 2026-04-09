import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MaterialIcon } from '../../../components/atoms/Icons';
import { authService } from '../../../services/auth.service';
import { branchService } from '../../../services/branch.service';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    branchId: '',
    designation: ''
  });
  const [branches, setBranches] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in - but allow access to registration
  // logic only if not logged in.
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response: any = await branchService.getAll();
        const branchesList = Array.isArray(response) ? response : (response.data || []);
        setBranches(branchesList);
      } catch (err) {
        console.error('Failed to fetch branches');
      }
    };
    fetchBranches();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.branchId) {
      setError('দয়া করে শাখা নির্বাচন করুন।');
      return;
    }
    if (!formData.phone) {
      setError('দয়া করে ফোন নাম্বার দিন।');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('পাসওয়ার্ড মিলছে না।');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        branchId: formData.branchId,
        designation: formData.designation
      };

      await authService.register(payload);
      alert('রেজিস্ট্রেশন সফল হয়েছে! অ্যাডমিন অ্যাপ্রুভ করলে আপনি লগিন করতে পারবেন।');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'রেজিস্ট্রেশন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-surface-container-low border border-outline-variant rounded-[2.5rem] p-10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-5 shadow-inner">
            <MaterialIcon name="person_add" size={40} />
          </div>
          <h1 className="text-3xl font-black text-primary tracking-tight">নতুন একাউন্ট</h1>
          <p className="text-sm text-on-surface-variant font-medium mt-2">আপনার তথ্য দিয়ে শুরু করুন (অ্যাডমিন অ্যাপ্রুভাল প্রয়োজন)</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 p-5 bg-error-container text-on-error-container rounded-3xl text-sm font-bold border border-error/10 flex items-center gap-3"
          >
            <MaterialIcon name="error" size={20} />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-2 col-span-2">
              <label className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-2 tracking-widest">পুরো নাম</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <MaterialIcon name="badge" size={22} />
                </span>
                <input 
                  name="name"
                  type="text" 
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="আপনার নাম লিখুন"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-2xl pl-12 pr-4 py-4 font-bold text-on-surface focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Designation */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-2 tracking-widest">পদবী</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <MaterialIcon name="work" size={22} />
                </span>
                <input 
                  name="designation"
                  type="text" 
                  required
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="যেমন: প্রোগ্রামার"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-2xl pl-12 pr-4 py-4 font-bold text-on-surface focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-2 tracking-widest">ফোন নাম্বার</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <MaterialIcon name="phone" size={22} />
                </span>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="যেমন: 01XXXXXXXXX"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-2xl pl-12 pr-4 py-4 font-bold text-on-surface focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-2 tracking-widest">ইমেইল</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <MaterialIcon name="mail" size={22} />
                </span>
                <input 
                  name="email"
                  type="email" 
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-2xl pl-12 pr-4 py-4 font-bold text-on-surface focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Branch Selection */}
            <div className="space-y-2 col-span-2">
              <label className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-2 tracking-widest">শাখা (Branch)</label>
              <div className="relative text-on-surface">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  <MaterialIcon name="account_balance" size={22} />
                </span>
                <select 
                  name="branchId"
                  required
                  value={formData.branchId}
                  onChange={handleChange}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-2xl pl-12 pr-10 py-4 font-bold text-on-surface focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none appearance-none cursor-pointer"
                  disabled={loading}
                >
                  <option value="">শাখা নির্বাচন করুন</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  <MaterialIcon name="expand_more" size={22} />
                </span>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-2 tracking-widest">পাসওয়ার্ড</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <MaterialIcon name="lock" size={22} />
                </span>
                <input 
                  name="password"
                  type="password" 
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-2xl pl-12 pr-4 py-4 font-bold text-on-surface focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-2 tracking-widest">নিশ্চিত করুন</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <MaterialIcon name="verified_user" size={22} />
                </span>
                <input 
                  name="confirmPassword"
                  type="password" 
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-2xl pl-12 pr-4 py-4 font-bold text-on-surface focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            type="submit"
            className="w-full bg-primary text-on-primary py-4 rounded-2xl mt-4 font-black text-lg shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
            ) : (
              <>
                <MaterialIcon name="how_to_reg" size={24} />
                রেজিস্ট্রেশন করুন
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-on-surface-variant font-medium">
            ইতিমধ্যে একাউন্ট আছে? 
            <Link to="/login" className="text-primary font-black ml-2 hover:underline decoration-2 underline-offset-4">লগিন করুন</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
