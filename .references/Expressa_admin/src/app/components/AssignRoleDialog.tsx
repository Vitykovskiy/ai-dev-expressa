import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from './Button';
import { User, UserRole } from '../types';
import * as RadioGroup from '@radix-ui/react-radio-group';

interface AssignRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (role: UserRole) => void;
  user: User | null;
}

export function AssignRoleDialog({
  open,
  onOpenChange,
  onConfirm,
  user,
}: AssignRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('barista');

  useEffect(() => {
    if (user && open) {
      setSelectedRole(user.role);
    }
  }, [user, open]);

  const handleConfirm = () => {
    onConfirm(selectedRole);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!user) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-[rgba(0,0,0,0.4)] z-50 animate-in fade-in duration-200"
          onClick={handleCancel}
        />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[16px] p-6 pb-safe z-50 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[16px] md:max-w-md md:w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom md:slide-in-from-top duration-200">
          <Dialog.Title className="text-lg font-semibold text-[#111111] mb-2">
            Назначить роль
          </Dialog.Title>
          <Dialog.Description className="text-sm text-[#555555] mb-6">
            Измените роль для выбранного пользователя
          </Dialog.Description>

          <div className="space-y-5 mb-6">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-[#F5F5F7] rounded-[10px]">
              <div className="w-10 h-10 rounded-full bg-[#E8E8FF] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-[#1A1AFF]">
                  {getInitials(user.name)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#111111]">{user.name}</div>
                {user.telegramUsername && (
                  <div className="text-xs text-[#999999] mt-0.5 truncate">{user.telegramUsername}</div>
                )}
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-[13px] font-medium text-[#555555] mb-3">
                Роль
              </label>
              <RadioGroup.Root
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as UserRole)}
                className="space-y-2"
              >
                <label className="flex items-center gap-3 p-3 rounded-[10px] border border-[#E0E0E0] cursor-pointer hover:bg-[#F5F5F7] transition-colors">
                  <RadioGroup.Item
                    value="barista"
                    className="w-5 h-5 rounded-full border-2 border-[#BDBDBD] data-[state=checked]:border-[#1A1AFF] data-[state=checked]:bg-[#1A1AFF] flex items-center justify-center"
                  >
                    <RadioGroup.Indicator className="w-2 h-2 rounded-full bg-white" />
                  </RadioGroup.Item>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[#111111]">Бариста</div>
                    <div className="text-xs text-[#999999] mt-0.5">Доступ к заказам и доступности</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-[10px] border border-[#E0E0E0] cursor-pointer hover:bg-[#F5F5F7] transition-colors">
                  <RadioGroup.Item
                    value="administrator"
                    className="w-5 h-5 rounded-full border-2 border-[#BDBDBD] data-[state=checked]:border-[#1A1AFF] data-[state=checked]:bg-[#1A1AFF] flex items-center justify-center"
                  >
                    <RadioGroup.Indicator className="w-2 h-2 rounded-full bg-white" />
                  </RadioGroup.Item>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[#111111]">Администратор</div>
                    <div className="text-xs text-[#999999] mt-0.5">Полный доступ ко всем функциям</div>
                  </div>
                </label>
              </RadioGroup.Root>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleConfirm}
            >
              Назначить роль
            </Button>
            <Button variant="ghost" className="w-full" onClick={handleCancel}>
              Отмена
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
