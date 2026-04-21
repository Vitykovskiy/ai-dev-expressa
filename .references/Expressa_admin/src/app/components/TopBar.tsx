import React from 'react';
import { RefreshCw } from 'lucide-react';

interface TopBarProps {
  title: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  onActionClick?: () => void;
  leftAction?: React.ReactNode;
}

export function TopBar({ title, onAction, actionIcon, onActionClick, leftAction }: TopBarProps) {
  return (
    <div className="h-[52px] bg-white border-b border-[#E0E0E0] px-4 flex items-center justify-between md:hidden">
      <div className="flex items-center gap-2">
        {leftAction}
        <h2 className="text-lg font-semibold text-[#111111]">{title}</h2>
      </div>
      {(onAction || onActionClick) && (
        <button onClick={onAction || onActionClick} className="text-[#555555]">
          {actionIcon || <RefreshCw size={22} />}
        </button>
      )}
    </div>
  );
}
