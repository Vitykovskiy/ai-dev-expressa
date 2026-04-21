import React from 'react';

interface FilterTab {
  id: string;
  label: string;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function FilterTabs({ tabs, activeTab, onTabChange }: FilterTabsProps) {
  return (
    <div className="sticky top-0 z-10 flex gap-2 overflow-x-auto px-4 py-3 bg-white md:static md:px-0 scrollbar-hide border-b border-[#E0E0E0] md:border-b-0">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-[999px] text-[13px] font-medium whitespace-nowrap transition-colors ${
            activeTab === tab.id
              ? 'bg-[#1A1AFF] text-white'
              : 'bg-[#F5F5F7] text-[#555555]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}