import React from 'react';
import { Clock } from 'lucide-react';
import { Order } from '../types';
import { StatusBadge } from './StatusBadge';
import { Button } from './Button';

interface OrderCardProps {
  order: Order;
  onConfirm?: () => void;
  onReject?: () => void;
  onReady?: () => void;
  onClose?: () => void;
}

export function OrderCard({ order, onConfirm, onReject, onReady, onClose }: OrderCardProps) {
  return (
    <div className="bg-white border border-[#E0E0E0] rounded-[16px] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between mb-2">
        <span className="text-[13px] font-medium text-[#999999] font-mono">
          {order.orderNumber}
        </span>
        <StatusBadge status={order.status} />
      </div>

      <div className="flex items-center gap-2 mb-1">
        <Clock size={14} className="text-[#999999]" />
        <span className="text-xs text-[#999999]">{order.slotTime}</span>
      </div>

      <div className="mb-2">
        <h3 className="text-[15px] font-semibold text-[#111111] mb-1">
          {order.customerName}
        </h3>
        <p className="text-sm text-[#555555] line-clamp-2">{order.items}</p>
      </div>

      <div className="mb-3">
        <p className="text-[15px] font-semibold text-[#111111]">{order.total} ₽</p>
      </div>

      <div className="flex gap-2">
        {order.status === 'Created' && (
          <>
            <Button variant="primary" className="flex-1" onClick={onConfirm}>
              Подтвердить
            </Button>
            <Button variant="destructive" className="flex-1" onClick={onReject}>
              Отклонить
            </Button>
          </>
        )}
        {order.status === 'Confirmed' && (
          <Button variant="primary" className="w-full" onClick={onReady}>
            Готово к выдаче
          </Button>
        )}
        {order.status === 'Ready for pickup' && (
          <Button variant="secondary" className="w-full" onClick={onClose}>
            Выдан
          </Button>
        )}
      </div>
    </div>
  );
}
