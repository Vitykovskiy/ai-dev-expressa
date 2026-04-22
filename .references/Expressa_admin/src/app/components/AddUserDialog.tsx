import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from './Button';
import { User } from '../types';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userData: {
    name: string;
    telegramUsername: string;
    role: User['role'];
  }) => void;
}

export function AddUserDialog({
  open,
  onOpenChange,
  onConfirm,
}: AddUserDialogProps) {
  const [name, setName] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [role, setRole] = useState<User['role']>('barista');

  const handleConfirm = () => {
    if (name.trim() && telegramUsername.trim()) {
      onConfirm({
        name: name.trim(),
        telegramUsername: telegramUsername.trim(),
        role,
      });
      handleReset();
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    handleReset();
    onOpenChange(false);
  };

  const handleReset = () => {
    setName('');
    setTelegramUsername('');
    setRole('barista');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isValid) {
      e.preventDefault();
      handleConfirm();
    }
  };

  const isValid = name.trim() && telegramUsername.trim();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay 
          className="fixed inset-0 bg-[rgba(0,0,0,0.4)] z-50 animate-in fade-in duration-200" 
          onClick={handleCancel}
        />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[16px] p-6 pb-safe z-50 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[16px] md:max-w-md md:w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom md:slide-in-from-top duration-200">
          <Dialog.Title className="text-lg font-semibold text-[#111111] mb-2">
            Новый пользователь
          </Dialog.Title>
          <Dialog.Description className="text-sm text-[#555555] mb-6">
            Добавьте нового пользователя в систему
          </Dialog.Description>

          <div className="space-y-4 mb-6">
            {/* Name */}
            <div>
              <label className="block text-[13px] font-medium text-[#555555] mb-1.5">
                Имя
              </label>
              <input
                type="text"
                placeholder="Например: Иван Петров"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#1A1AFF]"
                autoFocus
              />
            </div>

            {/* Telegram Username */}
            <div>
              <label className="block text-[13px] font-medium text-[#555555] mb-1.5">
                Telegram Username
              </label>
              <input
                type="text"
                placeholder="@username"
                value={telegramUsername}
                onChange={(e) => {
                  let value = e.target.value;
                  // Автоматически добавляем @ если его нет
                  if (value && !value.startsWith('@')) {
                    value = '@' + value;
                  }
                  setTelegramUsername(value);
                }}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#1A1AFF]"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-[13px] font-medium text-[#555555] mb-1.5">
                Роль
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as User['role'])}
                className="w-full px-3 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm text-[#111111] focus:outline-none focus:border-[#1A1AFF] bg-white"
              >
                <option value="barista">Бариста</option>
                <option value="administrator">Администратор</option>
              </select>
              <p className="text-xs text-[#999999] mt-1.5">
                Администраторы имеют полный доступ ко всем функциям
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleConfirm}
              disabled={!isValid}
            >
              Добавить пользователя
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
