import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

export function EmptyState({ icon: Icon, title, subtitle }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <Icon size={48} className="text-[#999999] mb-4" />
      <h3 className="text-lg font-semibold text-[#111111] mb-1">{title}</h3>
      <p className="text-sm text-[#999999]">{subtitle}</p>
    </div>
  );
}
