import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from './Button';
import { Switch } from './ui/switch';

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (categoryName: string, isOptionGroup: boolean, parentGroupId?: string) => void;
  categories?: string[];
  optionGroups?: string[]; // Список категорий, которые являются группами опций
}

export function AddCategoryDialog({
  open,
  onOpenChange,
  onConfirm,
  categories = [],
  optionGroups = [],
}: AddCategoryDialogProps) {
  const [categoryName, setCategoryName] = useState('');
  const [isOption, setIsOption] = useState(false);
  const [selectedParentGroup, setSelectedParentGroup] = useState('');

  const handleConfirm = () => {
    if (categoryName.trim()) {
      onConfirm(
        categoryName.trim(),
        isOption,
        isOption ? undefined : (selectedParentGroup || undefined)
      );
      handleReset();
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    handleReset();
    onOpenChange(false);
  };

  const handleReset = () => {
    setCategoryName('');
    setIsOption(false);
    setSelectedParentGroup('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && categoryName.trim()) {
      e.preventDefault();
      handleConfirm();
    }
  };

  // Показываем только группы опций для выбора
  const availableOptionGroups = optionGroups;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay 
          className="fixed inset-0 bg-[rgba(0,0,0,0.4)] z-50 animate-in fade-in duration-200" 
          onClick={handleCancel}
        />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[16px] p-6 pb-safe z-50 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[16px] md:max-w-md md:w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom md:slide-in-from-top duration-200">
          <Dialog.Title className="text-lg font-semibold text-[#111111] mb-2">
            Новая группа
          </Dialog.Title>
          <Dialog.Description className="text-sm text-[#555555] mb-6">
            Создайте новую группу для организации товаров в меню
          </Dialog.Description>

          <div className="space-y-5 mb-6">
            {/* Category Name */}
            <div>
              <label className="block text-[13px] font-medium text-[#555555] mb-1.5">
                Название группы
              </label>
              <input
                type="text"
                placeholder="Например: Кофе, Чай, Десерты"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#1A1AFF]"
                autoFocus
              />
            </div>

            {/* Option Group Toggle */}
            <div className="flex items-center justify-between py-3 border-b border-[#E0E0E0]">
              <div>
                <div className="text-[15px] font-semibold text-[#111111]">Группа опций</div>
                <div className="text-xs text-[#999999] mt-0.5">
                  Эта группа является набором опций для другой группы
                </div>
              </div>
              <Switch
                checked={isOption}
                onCheckedChange={setIsOption}
              />
            </div>

            {/* Parent Group Selection */}
            <div>
              <label className="block text-[13px] font-medium text-[#555555] mb-1.5">
                Выбрать группу опций
              </label>
              <select
                value={selectedParentGroup}
                onChange={(e) => setSelectedParentGroup(e.target.value)}
                disabled={isOption}
                className="w-full px-3 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm text-[#111111] focus:outline-none focus:border-[#1A1AFF] bg-white disabled:opacity-40 disabled:bg-[#F5F5F7]"
              >
                <option value="">Не выбрано</option>
                {availableOptionGroups.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {!isOption && availableOptionGroups.length === 0 && (
                <p className="text-xs text-[#999999] mt-1.5">
                  Нет доступных групп опций
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleConfirm}
              disabled={!categoryName.trim()}
            >
              Добавить категорию
            </Button>
            <Button variant="ghost" className="w-full" onClick={handleCancel}>
              Отмена
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}