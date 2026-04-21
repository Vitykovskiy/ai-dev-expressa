import React, { useState } from 'react';
import { RefreshCw, ClipboardCheck } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { FilterTabs } from '../components/FilterTabs';
import { OrderCard } from '../components/OrderCard';
import { EmptyState } from '../components/EmptyState';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Order, OrderStatus } from '../types';
import { toast } from 'sonner';

interface OrdersScreenProps {
  orders: Order[];
}

const filterTabs = [
  { id: 'all', label: 'Все' },
  { id: 'created', label: 'Новые' },
  { id: 'confirmed', label: 'Подтверждённые' },
  { id: 'ready', label: 'Готовы' },
];

export function OrdersScreen({ orders }: OrdersScreenProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === 'all') return order.status !== 'Closed' && order.status !== 'Rejected';
    if (activeFilter === 'created') return order.status === 'Created';
    if (activeFilter === 'confirmed') return order.status === 'Confirmed';
    if (activeFilter === 'ready') return order.status === 'Ready for pickup';
    return true;
  });

  const handleRefresh = () => {
    toast.success('Обновлено');
  };

  const handleConfirmOrder = (orderId: string) => {
    toast.success('Заказ подтверждён');
  };

  const handleRejectOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = (reason?: string) => {
    toast.error(`Заказ отклонён${reason ? `: ${reason}` : ''}`);
    setSelectedOrderId(null);
  };

  const handleReadyOrder = (orderId: string) => {
    toast.success('Заказ готов к выдаче');
  };

  const handleCloseOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCloseDialogOpen(true);
  };

  const handleCloseConfirm = () => {
    toast.success('Заказ выдан');
    setSelectedOrderId(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F5F5F7] md:bg-white h-full overflow-hidden">
      <TopBar 
        title="Заказы" 
        onAction={handleRefresh}
        actionIcon={<RefreshCw size={22} />}
      />

      <div className="md:px-6 md:pt-6">
        <h1 className="hidden md:block text-2xl font-bold text-[#111111] mb-4">Заказы</h1>
        <FilterTabs tabs={filterTabs} activeTab={activeFilter} onTabChange={setActiveFilter} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:pb-6 pb-20 md:pb-6">
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={ClipboardCheck}
            title="Заказов нет"
            subtitle="Активные заказы появятся здесь"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onConfirm={() => handleConfirmOrder(order.id)}
                onReject={() => handleRejectOrder(order.id)}
                onReady={() => handleReadyOrder(order.id)}
                onClose={() => handleCloseOrder(order.id)}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        title="Отклонить заказ"
        description="Укажите причину отклонения заказа"
        confirmLabel="Отклонить"
        confirmVariant="destructive"
        onConfirm={handleRejectConfirm}
        requireInput
        inputPlaceholder="Причина отклонения"
      />

      <ConfirmDialog
        open={closeDialogOpen}
        onOpenChange={setCloseDialogOpen}
        title="Выдать заказ"
        description="Подтвердите, что заказ был выдан клиенту"
        confirmLabel="Подтвердить"
        confirmVariant="primary"
        onConfirm={handleCloseConfirm}
      />
    </div>
  );
}