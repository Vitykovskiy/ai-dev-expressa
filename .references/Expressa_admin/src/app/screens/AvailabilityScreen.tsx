import React, { useState } from 'react';
import { ToggleRight } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { FilterTabs } from '../components/FilterTabs';
import { ToggleRow } from '../components/ToggleRow';
import { EmptyState } from '../components/EmptyState';
import { MenuItem } from '../types';
import { toast } from 'sonner';

interface AvailabilityScreenProps {
  menuItems: MenuItem[];
}

export function AvailabilityScreen({ menuItems }: AvailabilityScreenProps) {
  const [items, setItems] = useState(menuItems);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))];
  const categoryTabs = categories.map(cat => ({
    id: cat,
    label: cat === 'all' ? 'Все' : cat,
  }));

  const filteredItems = items.filter(item => 
    activeCategory === 'all' || item.category === activeCategory
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const handleToggle = (itemId: string, checked: boolean) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, available: checked } : item
    ));
    toast.success('Сохранено');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F5F5F7] md:bg-white h-full overflow-hidden">
      <TopBar title="Доступность" />

      <div className="md:px-6 md:pt-6">
        <h1 className="hidden md:block text-2xl font-bold text-[#111111] mb-4">Доступность</h1>
        <FilterTabs tabs={categoryTabs} activeTab={activeCategory} onTabChange={setActiveCategory} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:pb-6 pb-20 md:pb-6">
        {Object.keys(groupedItems).length === 0 ? (
          <EmptyState
            icon={ToggleRight}
            title="Меню пусто"
            subtitle="Позиции появятся после добавления в меню"
          />
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category} className="bg-white border border-[#E0E0E0] rounded-[16px] overflow-hidden">
                <div className="px-4 py-3 border-b border-[#E0E0E0]">
                  <h3 className="text-[13px] font-medium text-[#999999] uppercase tracking-wide">
                    {category}
                  </h3>
                </div>
                <div className="px-4">
                  {categoryItems.map((item) => (
                    <ToggleRow
                      key={item.id}
                      label={item.name}
                      sublabel={item.price ? `${item.price} ₽` : 'Несколько размеров'}
                      checked={item.available}
                      onChange={(checked) => handleToggle(item.id, checked)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}