import React from 'react';

export function OrderCardSkeleton() {
  return (
    <div className="bg-white border border-[#E0E0E0] rounded-[16px] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)] animate-pulse">
      <div className="flex items-start justify-between mb-2">
        <div className="h-4 w-16 bg-[#F5F5F7] rounded" />
        <div className="h-5 w-20 bg-[#F5F5F7] rounded-full" />
      </div>

      <div className="flex items-center gap-2 mb-1">
        <div className="h-3.5 w-3.5 bg-[#F5F5F7] rounded-full" />
        <div className="h-3 w-12 bg-[#F5F5F7] rounded" />
      </div>

      <div className="mb-2">
        <div className="h-5 w-32 bg-[#F5F5F7] rounded mb-2" />
        <div className="h-4 w-full bg-[#F5F5F7] rounded mb-1" />
        <div className="h-4 w-3/4 bg-[#F5F5F7] rounded" />
      </div>

      <div className="mb-3">
        <div className="h-5 w-20 bg-[#F5F5F7] rounded" />
      </div>

      <div className="flex gap-2">
        <div className="h-10 flex-1 bg-[#F5F5F7] rounded-[10px]" />
        <div className="h-10 flex-1 bg-[#F5F5F7] rounded-[10px]" />
      </div>
    </div>
  );
}
