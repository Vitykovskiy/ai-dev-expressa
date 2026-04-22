import React, { useState } from 'react';
import { TopBar } from '../components/TopBar';
import { Button } from '../components/Button';
import { Settings as SettingsType } from '../types';
import { toast } from 'sonner';

interface SettingsScreenProps {
  settings: SettingsType;
}

export function SettingsScreen({ settings: initialSettings }: SettingsScreenProps) {
  const [settings, setSettings] = useState(initialSettings);

  const handleSave = () => {
    toast.success('Настройки сохранены');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F5F5F7] md:bg-white h-full overflow-hidden">
      <TopBar title="Настройки" />

      <div className="md:px-6 md:pt-6 md:max-w-[560px] md:mx-auto md:w-full">
        <h1 className="hidden md:block text-2xl font-bold text-[#111111] mb-4">Настройки</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 pb-20 md:pb-6 md:max-w-[560px] md:mx-auto md:w-full">
        <div className="space-y-6">
          {/* Working Hours */}
          <div className="bg-white border border-[#E0E0E0] rounded-[16px] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E0E0E0]">
              <h3 className="text-[13px] font-medium text-[#999999] uppercase tracking-wide">
                Рабочие часы
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#555555] mb-1.5">
                  Открытие
                </label>
                <input
                  type="time"
                  value={settings.workingHoursOpen}
                  onChange={(e) => setSettings({ ...settings, workingHoursOpen: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-[10px] bg-white border border-[#E0E0E0] text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#1A1AFF]/20"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#555555] mb-1.5">
                  Закрытие
                </label>
                <input
                  type="time"
                  value={settings.workingHoursClose}
                  onChange={(e) => setSettings({ ...settings, workingHoursClose: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-[10px] bg-white border border-[#E0E0E0] text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#1A1AFF]/20"
                />
              </div>
            </div>
          </div>

          {/* Slot Capacity */}
          <div className="bg-white border border-[#E0E0E0] rounded-[16px] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E0E0E0]">
              <h3 className="text-[13px] font-medium text-[#999999] uppercase tracking-wide">
                Слоты
              </h3>
            </div>
            <div className="p-4">
              <label className="block text-[13px] font-medium text-[#555555] mb-1.5">
                Вместимость слота (заказов)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.slotCapacity}
                onChange={(e) => setSettings({ ...settings, slotCapacity: parseInt(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-[10px] bg-white border border-[#E0E0E0] text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#1A1AFF]/20"
              />
              <p className="text-xs text-[#999999] mt-1.5">
                Сколько активных заказов помещается в один 10-минутный слот
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button - Fixed for both mobile and desktop */}
      <div className="p-4 pb-safe bg-white border-t border-[#E0E0E0] md:max-w-[560px] md:mx-auto md:w-full md:mb-6">
        <Button variant="primary" className="w-full" onClick={handleSave}>
          Сохранить
        </Button>
      </div>
    </div>
  );
}