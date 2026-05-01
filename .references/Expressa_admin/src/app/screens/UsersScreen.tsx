import React, { useState } from 'react';
import { Search, Users as UsersIcon } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { FilterTabs } from '../components/FilterTabs';
import { EmptyState } from '../components/EmptyState';
import { UserActionsMenu } from '../components/UserActionsMenu';
import { AssignRoleDialog } from '../components/AssignRoleDialog';
import { User, UserRole } from '../types';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignRoleDialog, setShowAssignRoleDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter((user) => {
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesName = user.name.toLowerCase().includes(query);
      const matchesTelegram = user.telegramUsername?.toLowerCase().includes(query);
      if (!matchesName && !matchesTelegram) return false;
    }

    // Filter by tab
    if (activeFilter === 'all') return true;
    if (activeFilter === 'barista') return user.role === 'barista';
    if (activeFilter === 'blocked') return user.status === 'blocked';
    return true;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleAssignRole = (user: User) => {
    setSelectedUser(user);
    setShowAssignRoleDialog(true);
  };

  const handleRevokeRole = (user: User) => {
    console.log('Снятие роли баристы:', user.id);
    toast.success(`Роль баристы снята у пользователя "${user.name}"`);
    // Здесь должна быть логика изменения роли в store
  };

  const handleBlock = (user: User) => {
    console.log('Блокировка пользователя:', user.id);
    toast.success(`Пользователь "${user.name}" заблокирован`);
    // Здесь должна быть логика блокировки в store
  };

  const handleUnblock = (user: User) => {
    console.log('Разблокировка пользователя:', user.id);
    toast.success(`Пользователь "${user.name}" разблокирован`);
    // Здесь должна быть логика разблокировки в store
  };

  const handleConfirmAssignRole = (role: UserRole) => {
    if (selectedUser) {
      console.log('Назначение роли:', selectedUser.id, role);
      toast.success(`Роль "${role === 'barista' ? 'Бариста' : 'Администратор'}" назначена пользователю "${selectedUser.name}"`);
      // Здесь должна быть логика назначения роли в store
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F5F5F7] md:bg-white h-full overflow-hidden">
      <TopBar title="Пользователи" />

      <div className="md:px-6 md:pt-6 md:max-w-[720px] md:mx-auto md:w-full">
        <div className="hidden md:flex md:items-center md:justify-between md:mb-4">
          <h1 className="text-2xl font-bold text-[#111111]">Пользователи</h1>
        </div>

        {/* Search Input - Always Visible */}
        <div className="px-4 pt-4 pb-3 md:px-0 md:pt-0 md:mb-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]" />
            <input
              type="text"
              placeholder="Фильтр по имени или Telegram"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-[10px] bg-[#F5F5F7] border border-[#E0E0E0] text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#1A1AFF]/20"
            />
          </div>
        </div>

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
                    <UserActionsMenu
                      user={user}
                      onAssignRole={() => handleAssignRole(user)}
                      onRevokeRole={() => handleRevokeRole(user)}
                      onBlock={() => handleBlock(user)}
                      onUnblock={() => handleUnblock(user)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AssignRoleDialog
        open={showAssignRoleDialog}
        onOpenChange={setShowAssignRoleDialog}
        onConfirm={handleConfirmAssignRole}
        user={selectedUser}
      />
    </div>
  );
}