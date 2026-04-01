import { motion, AnimatePresence } from 'motion/react';
import { NavLink } from 'react-router-dom';
import { MaterialIcon } from '../atoms/Icons';
import { useSidebar } from '../templates/DashboardTemplate';

const navItems = [
  { icon: 'dashboard', label: 'ড্যাশবোর্ড', path: '/' },
  { icon: 'inventory_2', label: 'ইনভেন্টরি', path: '/inventory' },
  { icon: 'person_search', label: 'অফিসার ম্যানেজমেন্ট', path: '/officers' },
  { icon: 'assignment_return', label: 'ইস্যু/রিটার্ন', path: '/assignments' },
  { icon: 'build', label: 'মেইনটেন্যান্স', path: '/maintenance' },
  { icon: 'lan', label: 'NOC', path: '/noc' },
  { icon: 'analytics', label: 'রিপোর্টস', path: '/reports' },
  { icon: 'settings', label: 'সেটিংস', path: '/settings' },
];

export default function Sidebar() {
  const { isCollapsed, setIsCollapsed } = useSidebar();

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-full bg-surface-container-low border-r border-outline-variant flex flex-col py-4 z-50"
    >
      <div className={`mb-10 flex items-center px-4 transition-all duration-300 ${isCollapsed ? 'justify-center' : 'justify-start gap-3'}`}>
        <div className={`rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-on-primary shadow-lg shadow-primary/20 transition-all duration-300 ${
          isCollapsed ? 'w-12 h-12' : 'w-10 h-10'
        }`}>
          <MaterialIcon name="inventory_2" fill size={isCollapsed ? 28 : 24} />
        </div>
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="whitespace-nowrap"
            >
              <h1 className="text-lg font-black text-primary tracking-tight leading-none font-sans">অ্যাসেটফ্লো</h1>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold font-sans">MoCHTA Admin</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Toggle Button - Centered vertically with TopBar (h-16 = 64px, so top-8 = 32px) */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-5 w-6 h-6 bg-surface border border-outline-variant rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary shadow-md z-[70] transition-all duration-200"
      >
        <MaterialIcon name={isCollapsed ? "chevron_right" : "chevron_left"} size={16} />
      </button>

      <nav className="flex-1 px-3 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => `flex items-center rounded-full font-semibold transition-all duration-200 overflow-hidden ${
              isCollapsed ? 'justify-center h-14 w-14 mx-auto px-0' : 'gap-3 px-4 py-3.5'
            } ${
              isActive 
                ? 'bg-secondary-container text-on-secondary-container shadow-sm' 
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {({ isActive }) => (
              <>
                <div className="flex-shrink-0 flex items-center justify-center">
                  <MaterialIcon name={item.icon} fill={isActive} size={24} />
                </div>
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className={`pt-4 border-t border-outline-variant space-y-2 ${isCollapsed ? 'px-0' : 'px-3'}`}>
        <motion.a
          href="#"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center text-error hover:bg-error-container rounded-full transition-all duration-200 overflow-hidden ${
            isCollapsed ? 'justify-center h-14 w-14 mx-auto' : 'gap-3 px-4 py-3.5'
          }`}
        >
          <div className="flex-shrink-0 flex items-center justify-center">
            <MaterialIcon name="logout" size={24} />
          </div>
          {!isCollapsed && <span className="text-sm font-sans whitespace-nowrap">Logout</span>}
        </motion.a>
      </div>
    </motion.aside>
  );
}
