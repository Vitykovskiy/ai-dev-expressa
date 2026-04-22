import React, { useState } from 'react';
import { Search, Users as UsersIcon, MoreVertical, Plus } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { FilterTabs } from '../components/FilterTabs';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { AddUserDialog } from '../components/AddUserDialog';
import { User } from '../types';
import { toast } from 'sonner';

interface UsersScreenProps {
  users: User[];
}

const filterTabs = [
  { id: 'all', label: 'Все' },
  { id: 'barista', label: 'Баристы' },
  { id: 'blocked', label: 'Заблокированные' },
];

const getRoleBadge = (role: User['role']) => {
  if (role === 'administrator') {
    return { bg: '#E8E8FF', color: '#1A1AFF', label: 'Администратор' };
  }
  return { bg: '#E8F5E9', color: '#2E7D32', label: 'Бариста' };
};

const getStatusBadge = (status: User['status']) => {
  if (status === 'active') {
    return { bg: '#E8F5E9', color: '#2E7D32', label: 'Активен' };
  }
  return { bg: '#FFEBEE', color: '#D32F2F', label: 'Заблокирован' };
};

export function UsersScreen({ users }: UsersScreenProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);

  const filteredUsers = users.filter((user) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'barista') return user.role === 'barista';
    if (activeFilter === 'blocked') return user.status === 'blocked';
    return true;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleAddUser = (userData: {
    name: string;
    telegramUsername: string;
    role: User['role'];
  }) => {
    console.log('Добавление пользователя:', userData);
    toast.success(`Пользователь "${userData.name}" добавлен`);
    // Здесь должна быть логика добавления пользователя в store
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F5F5F7] md:bg-white h-full overflow-hidden">
      <TopBar 
        title="Пользователи"
        actionIcon={<Search size={22} />}
        onAction={() => setSearchOpen(!searchOpen)}
      />

      <div className="md:px-6 md:pt-6 md:max-w-[720px] md:mx-auto md:w-full">
        <div className="hidden md:flex md:items-center md:justify-between md:mb-4">
          <h1 className="text-2xl font-bold text-[#111111]">Пользователи</h1>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-lg hover:bg-[#F5F5F7] transition-colors"
            title="Поиск"
          >
            <Search size={22} className="text-[#555555]" />
          </button>
        </div>

        {/* Add User Button */}
        <div className="px-4 md:px-0 pt-4 md:pt-0 pb-3">
          <Button
            icon={<Plus size={20} />}
            onClick={() => setShowAddUserDialog(true)}
          >
            Добавить пользователя
          </Button>
        </div>
        
        {searchOpen && (
          <div className="px-4 py-3 md:px-0 md:mb-4">
            <input
              type="text"
              placeholder="Поиск по имени или Telegram"
              className="w-full px-3 py-2.5 rounded-[10px] bg-[#F5F5F7] border border-[#E0E0E0] text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#1A1AFF]/20"
              autoFocus
            />
          </div>
        )}
        
        <FilterTabs tabs={filterTabs} activeTab={activeFilter} onTabChange={setActiveFilter} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:pb-6 md:max-w-[720px] md:mx-auto md:w-full pb-20 md:pb-6">
        {filteredUsers.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="Пользователей нет"
            subtitle="Они появятся после активации бота"
          />
        ) : (
          <div className="bg-white border border-[#E0E0E0] rounded-[16px] overflow-hidden">
            {filteredUsers.map((user, index) => {
              const roleBadge = getRoleBadge(user.role);
              const statusBadge = getStatusBadge(user.status);
              
              return (
                <div
                  key={user.id}
                  className={`flex items-center justify-between px-4 py-3.5 ${
                    index !== filteredUsers.length - 1 ? 'border-b border-[#E0E0E0]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-9 h-9 rounded-full bg-[#E8E8FF] flex items-center justify-center">
                      <span className="text-xs font-medium text-[#1A1AFF]">
                        {getInitials(user.name)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-[15px] font-semibold text-[#111111]">{user.name}</div>
                      {user.telegramUsername && (
                        <div className="text-xs text-[#999999] mt-0.5">{user.telegramUsername}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded-[999px] text-xs"
                      style={{ backgroundColor: roleBadge.bg, color: roleBadge.color }}
                    >
                      {roleBadge.label}
                    </span>
                    <button className="p-1 text-[#999999] hover:text-[#555555]">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddUserDialog
        open={showAddUserDialog}
        onOpenChange={setShowAddUserDialog}
        onConfirm={handleAddUser}
      />
    </div>
  );
}