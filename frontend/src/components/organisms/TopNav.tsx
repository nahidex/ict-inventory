import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MaterialIcon } from '../atoms/Icons';

const navItems = [
  { icon: 'dashboard', label: 'ড্যাশবোর্ড', path: '/' },
  { icon: 'inventory_2', label: 'ইনভেন্টরি', path: '/inventory' },
  { icon: 'person_search', label: 'অফিসার', path: '/officers' },
  { icon: 'assignment_return', label: 'ইস্যু/রিটার্ন', path: '/assignments' },
  { icon: 'build', label: 'মেইনটেন্যান্স', path: '/maintenance' },
];

export default function TopNav() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface/95 backdrop-blur-md border-b border-outline-variant z-50 px-4 md:px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3 md:gap-6">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant"
        >
          <MaterialIcon name={isMenuOpen ? "close" : "menu"} size={24} />
        </button>

        {/* Logo */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <MaterialIcon name="inventory_2" fill size={20} />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base md:text-lg font-black text-primary tracking-tight leading-none font-sans">অ্যাসেটফ্লো</h1>
            <p className="text-[8px] md:text-[10px] text-on-surface-variant uppercase tracking-widest font-bold font-sans">MoCHTA Admin</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <MaterialIcon name={item.icon} size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden md:flex items-center bg-surface-container-high rounded-full px-4 py-1.5 border border-outline-variant focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <MaterialIcon name="search" size={18} className="text-on-surface-variant" />
          <input 
            type="text" 
            placeholder="খুঁজুন..." 
            className="bg-transparent border-none focus:ring-0 text-xs font-medium w-32 lg:w-48 placeholder:text-on-surface-variant/50"
          />
        </div>
        
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant relative">
          <MaterialIcon name="notifications" size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
        </button>

        <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary-container overflow-hidden border border-outline-variant cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDplVX9XF-BIUgAvvvjbfrSlLVFOrogQ6lbynUmEvaPAg23b9eCEveyKRiMgj2ibt9-7VevD9ueoAn3HYizLtP1mchrMsiw0unZRhzG8wH5J8TSzjvMwmXyod56HVODQ6Jyc-hOlc8vJrJ8g5SNB3x9ZGLEB53R69wy-gRKPDr5omeNyxO0rwGpKDj-q0P1ce0qj0zLoO_iIK2uZaI5C7AZXqm5hASYbraJdOiBssuVHRxpX8ry9pXN_mq_Rzc4CR63BWLWGjuULmc" 
            alt="User" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-surface z-[70] lg:hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-outline-variant flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary">
                    <MaterialIcon name="inventory_2" size={20} />
                  </div>
                  <h2 className="font-black text-primary tracking-tight">অ্যাসেটফ্লো</h2>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high">
                  <MaterialIcon name="close" size={20} />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isActive 
                        ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                        : 'text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <MaterialIcon name={item.icon} size={22} />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="p-4 border-t border-outline-variant">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-error hover:bg-error/10 transition-all">
                  <MaterialIcon name="logout" size={22} />
                  লগআউট
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
