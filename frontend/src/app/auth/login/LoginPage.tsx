import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MaterialIcon } from '../../../components/atoms/Icons';
import { authService } from '../../../services/auth.service';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });
      
      // Save token and auth state
      localStorage.setItem('token', response.token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(response.user));
      
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'লগিন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface-container-low border border-outline-variant rounded-3xl p-8 shadow-xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MaterialIcon name="admin_panel_settings" size={32} />
          </div>
          <h1 className="text-2xl font-black text-primary tracking-tight font-sans">অ্যাসেট লগিন</h1>
          <p className="text-sm text-on-surface-variant font-medium">সিস্টেমে প্রবেশ করতে তথ্য দিন</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-2xl text-sm font-bold flex items-center gap-2 border border-error/20">
            <MaterialIcon name="error" size={20} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2">ইমেইল এড্রেস</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                <MaterialIcon name="mail" size={20} />
              </span>
              <input 
                type="email" 
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-2xl pl-12 pr-4 py-3 font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-2">পাসওয়ার্ড</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                <MaterialIcon name="lock" size={20} />
              </span>
              <input 
                type="password" 
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-2xl pl-12 pr-4 py-3 font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-on-primary py-4 rounded-2xl font-black shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:bg-primary/50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
            ) : (
              <>
                <MaterialIcon name="login" size={20} />
                লগিন করুন
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-on-surface-variant font-medium">
            পাসওয়ার্ড ভুলে গেছেন? <button className="text-primary font-bold hover:underline">রিসেট করুন</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
