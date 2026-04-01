import { useNavigate } from 'react-router-dom';
import { MaterialIcon } from '../atoms/Icons';
import { useSidebar } from '../templates/DashboardTemplate';

export default function TopBar() {
  const { isCollapsed } = useSidebar();
  const navigate = useNavigate();

  return (
    <header 
      className="fixed top-0 right-0 h-16 bg-surface/90 backdrop-blur-md border-b border-outline-variant z-40 px-8 flex justify-between items-center transition-all duration-300"
      style={{ left: isCollapsed ? '80px' : '280px' }}
    >
      <div className="flex items-center gap-4 flex-1">
        <h2 className="text-xl font-bold text-primary tracking-tight font-sans">অ্যাসেটফ্লো</h2>
      </div>

      <div className="flex-[2] max-w-2xl px-4">
        <div className="relative group">
          <MaterialIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            className="w-full h-11 bg-surface-container-high border-none rounded-full pl-12 pr-12 text-sm focus:ring-2 focus:ring-primary transition-all placeholder:text-on-surface-variant/70"
            placeholder="ডিভাইস, সিরিয়াল নম্বর বা কর্মকর্তা খুঁজুন..."
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
            <MaterialIcon name="qr_code_scanner" size={20} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-1 justify-end">
        <button 
          onClick={() => navigate('/inventory/add')}
          className="bg-primary text-on-primary px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:brightness-110 transition-all shadow-md shadow-primary/20"
        >
          <MaterialIcon name="add" size={20} />
          <span>নতুন এসেট</span>
        </button>
        <div className="h-8 w-[1px] bg-outline-variant mx-1"></div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors">
          <MaterialIcon name="notifications" className="text-on-surface-variant" size={20} />
        </button>
        <div className="h-10 w-10 rounded-full bg-primary-container overflow-hidden border border-outline-variant cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDplVX9XF-BIUgAvvvjbfrSlLVFOrogQ6lbynUmEvaPAg23b9eCEveyKRiMgj2ibt9-7VevD9ueoAn3HYizLtP1mchrMsiw0unZRhzG8wH5J8TSzjvMwmXyod56HVODQ6Jyc-hOlc8vJrJ8g5SNB3x9ZGLEB53R69wy-gRKPDr5omeNyxO0rwGpKDj-q0P1ce0qj0zLoO_iIK2uZaI5C7AZXqm5hASYbraJdOiBssuVHRxpX8ry9pXN_mq_Rzc4CR63BWLWGjuULmc" 
            alt="User Profile" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
}
