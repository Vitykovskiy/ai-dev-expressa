import React from 'react';
import { Outlet } from 'react-router';
import { TabBar } from './components/TabBar';
import { SideNav } from './components/SideNav';
import { useAppStore } from './store';

export function RootLayout() {
  const { currentRole } = useAppStore();

  return (
    <div className="h-screen flex bg-[#F5F5F7]">
      <SideNav currentRole={currentRole} />
      
      <div className="flex-1 flex flex-col md:ml-[220px]">
        <Outlet />
        <TabBar currentRole={currentRole} />
      </div>
    </div>
  );
}
