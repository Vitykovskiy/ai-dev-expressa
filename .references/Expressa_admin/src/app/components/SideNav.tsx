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

interface SideNavProps {
  currentRole: UserRole;
}

const tabs = [
  { id: 'orders', label: 'Заказы', icon: ClipboardList, path: '/', roles: ['barista', 'administrator'] },
  { id: 'availability', label: 'Доступность', icon: ToggleRight, path: '/availability', roles: ['barista', 'administrator'] },
  { id: 'menu', label: 'Меню', icon: BookOpen, path: '/menu', roles: ['administrator'] },
  { id: 'users', label: 'Пользователи', icon: Users, path: '/users', roles: ['administrator'] },
  { id: 'settings', label: 'Настройки', icon: Settings, path: '/settings', roles: ['administrator'] },
];

export function SideNav({ currentRole }: SideNavProps) {
  const visibleTabs = tabs.filter(tab => tab.roles.includes(currentRole));

  return (
    <nav className="hidden md:flex flex-col w-[220px] bg-[#F5F5F7] border-r border-[#E0E0E0] h-screen fixed left-0 top-0 p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-[#111111]">Expressa</h1>
        <p className="text-xs text-[#999999] mt-1">
          {currentRole === 'administrator' ? 'Администратор' : 'Бариста'}
        </p>
      </div>

      <div className="flex flex-col gap-1">
        {visibleTabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-[10px] text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-[#E8E8FF] text-[#1A1AFF]'
                  : 'text-[#555555] hover:bg-[#E0E0E0]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <tab.icon size={20} />
                <span>{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
