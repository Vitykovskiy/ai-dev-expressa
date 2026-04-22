import React from 'react';
import { NavLink } from 'react-router';
import { 
  ClipboardList, 
  ToggleRight, 
  BookOpen, 
  Users, 
  Settings 
} from 'lucide-react';
import { UserRole } from '../types';

interface TabBarProps {
  currentRole: UserRole;
}

const tabs = [
  { id: 'orders', label: 'Заказы', icon: ClipboardList, path: '/', roles: ['barista', 'administrator'] },
  { id: 'availability', label: 'Доступность', icon: ToggleRight, path: '/availability', roles: ['barista', 'administrator'] },
  { id: 'menu', label: 'Меню', icon: BookOpen, path: '/menu', roles: ['administrator'] },
  { id: 'users', label: 'Пользователи', icon: Users, path: '/users', roles: ['administrator'] },
  { id: 'settings', label: 'Настройки', icon: Settings, path: '/settings', roles: ['administrator'] },
];

export function TabBar({ currentRole }: TabBarProps) {
  const visibleTabs = tabs.filter(tab => tab.roles.includes(currentRole));

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[60px] bg-white border-t border-[#E0E0E0] shadow-[0_-1px_0_#E0E0E0] flex items-center justify-around pb-safe z-50">
      {visibleTabs.map((tab) => (
        <NavLink
          key={tab.id}
          to={tab.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 flex-1 h-full relative ${
              isActive ? 'text-[#1A1AFF]' : 'text-[#999999]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#1A1AFF]" />
              )}
              <tab.icon size={22} />
              <span className="text-xs">{tab.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
