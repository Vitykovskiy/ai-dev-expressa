import React from 'react';
import * as Switch from '@radix-ui/react-switch';

interface ToggleRowProps {
  label: string;
  sublabel?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function ToggleRow({ label, sublabel, checked, onChange, disabled }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-[#E0E0E0] last:border-b-0">
      <div className="flex-1">
        <div className={`text-[15px] font-semibold ${disabled ? 'text-[#999999]' : 'text-[#111111]'}`}>
          {label}
        </div>
        {sublabel && (
          <div className="text-xs text-[#999999] mt-0.5">{sublabel}</div>
        )}
      </div>
      
      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className="w-11 h-6 bg-[#BDBDBD] rounded-full relative data-[state=checked]:bg-[#1A1AFF] transition-colors disabled:opacity-40"
      >
        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
      </Switch.Root>
    </div>
  );
}
