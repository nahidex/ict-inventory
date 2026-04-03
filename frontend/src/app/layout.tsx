import { ReactNode } from 'react';
import DashboardTemplate from '../components/templates/DashboardTemplate';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <DashboardTemplate>
      {children}
    </DashboardTemplate>
  );
}
