import React from 'react';
import { OrderStatus } from '../types';

interface StatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { bg: string; color: string; label: string }> = {
  'Created': { bg: '#E8E8FF', color: '#1A1AFF', label: 'Новый' },
  'Confirmed': { bg: '#E8F5E9', color: '#2E7D32', label: 'Подтверждён' },
  'Ready for pickup': { bg: '#FFF3E0', color: '#E65100', label: 'Готов' },
  'Rejected': { bg: '#FFEBEE', color: '#D32F2F', label: 'Отклонён' },
  'Closed': { bg: '#F5F5F5', color: '#757575', label: 'Закрыт' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className="px-2.5 py-0.5 rounded-[999px] text-xs"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}
