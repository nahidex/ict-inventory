import Sidebar from '../organisms/Sidebar';
import TopBar from '../organisms/TopBar';
import FAB from '../atoms/FAB';
import { ReactNode, useState, createContext, useContext } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebar must be used within a SidebarProvider');
  return context;
};

interface DashboardTemplateProps {
  children: ReactNode;
}

export default function DashboardTemplate({ children }: DashboardTemplateProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="min-h-screen bg-background text-on-surface">
        <Sidebar />
        <main 
          className="transition-all duration-300 min-h-screen pt-36 lg:pt-24 pb-12 px-4 lg:px-8 max-w-[1600px] mx-auto"
          style={{ marginLeft: typeof window !== 'undefined' && window.innerWidth < 1024 ? '0' : (isCollapsed ? '80px' : '280px') }}
        >
          <TopBar />
          {children}
          <FAB />
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
