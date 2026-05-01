import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreVertical, UserCog, UserMinus, Ban, Unlock } from 'lucide-react';
import { User } from '../types';

interface UserActionsMenuProps {
  user: User;
  onAssignRole: () => void;
  onRevokeRole: () => void;
  onBlock: () => void;
  onUnblock: () => void;
}

export function UserActionsMenu({
  user,
  onAssignRole,
  onRevokeRole,
  onBlock,
  onUnblock,
}: UserActionsMenuProps) {
  const isBarista = user.role === 'barista';
  const isBlocked = user.status === 'blocked';

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="p-1 text-[#999999] hover:text-[#555555] transition-colors rounded-lg hover:bg-[#F5F5F7]">
          <MoreVertical size={20} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-white rounded-[10px] p-1 shadow-[0_8px_32px_rgba(0,0,0,0.16)] z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          sideOffset={5}
          align="end"
        >
          {!isBlocked && (
            <>
              <DropdownMenu.Item
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#111111] rounded-lg outline-none cursor-pointer hover:bg-[#F5F5F7] transition-colors"
                onSelect={onAssignRole}
              >
                <UserCog size={18} className="text-[#555555]" />
                <span>Назначить роль</span>
              </DropdownMenu.Item>

              {isBarista && (
                <DropdownMenu.Item
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#111111] rounded-lg outline-none cursor-pointer hover:bg-[#F5F5F7] transition-colors"
                  onSelect={onRevokeRole}
                >
                  <UserMinus size={18} className="text-[#555555]" />
                  <span>Снять роль баристы</span>
                </DropdownMenu.Item>
              )}

              <DropdownMenu.Separator className="h-px bg-[#E0E0E0] my-1" />

              <DropdownMenu.Item
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#D32F2F] rounded-lg outline-none cursor-pointer hover:bg-[#FFEBEE] transition-colors"
                onSelect={onBlock}
              >
                <Ban size={18} />
                <span>Заблокировать</span>
              </DropdownMenu.Item>
            </>
          )}

          {isBlocked && (
            <DropdownMenu.Item
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#2E7D32] rounded-lg outline-none cursor-pointer hover:bg-[#E8F5E9] transition-colors"
              onSelect={onUnblock}
            >
              <Unlock size={18} />
              <span>Разблокировать</span>
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
