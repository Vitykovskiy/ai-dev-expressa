import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Plus, Edit3, Trash2, X, ChevronDown } from 'lucide-react';
import { Button } from './Button';

interface MenuGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MenuGuide({ open, onOpenChange }: MenuGuideProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay 
          className="fixed inset-0 bg-[rgba(0,0,0,0.4)] z-50 animate-in fade-in duration-200" 
        />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[16px] z-50 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[16px] md:max-w-2xl md:w-full max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom md:slide-in-from-top duration-200">
          <div className="sticky top-0 bg-white border-b border-[#E0E0E0] px-6 py-4 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-[#111111]">
              Как работать с меню
            </Dialog.Title>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 -mr-2 rounded-lg hover:bg-[#F5F5F7] transition-colors"
            >
              <X size={20} className="text-[#555555]" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Добавление категорий */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E8E8FF] flex items-center justify-center flex-shrink-0">
                  <Plus size={20} className="text-[#1A1AFF]" />
                </div>
                <h3 className="text-[15px] font-semibold text-[#111111]">
                  Добавление группы
                </h3>
              </div>
              <div className="ml-13 pl-3 border-l-2 border-[#E0E0E0] space-y-2">
                <p className="text-sm text-[#555555]">
                  1. Нажмите кнопку <strong>«Добавить группу»</strong> в верхней части экрана
                </p>
                <p className="text-sm text-[#555555]">
                  2. Введите название группы (например: Кофе, Чай, Десерты)
                </p>
                <p className="text-sm text-[#555555]">
                  3. Нажмите <strong>«Добавить категорию»</strong>
                </p>
              </div>
            </div>

            {/* Редактирование категорий */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E8E8FF] flex items-center justify-center flex-shrink-0">
                  <Edit3 size={20} className="text-[#1A1AFF]" />
                </div>
                <h3 className="text-[15px] font-semibold text-[#111111]">
                  Редактирование группы
                </h3>
              </div>
              <div className="ml-13 pl-3 border-l-2 border-[#E0E0E0] space-y-2">
                <p className="text-sm text-[#555555]">
                  1. Нажмите иконку <strong>редактирования</strong> справа от названия группы
                </p>
                <p className="text-sm text-[#555555]">
                  2. Измените название или удалите группу (удаление возможно только для пустых групп)
                </p>
                <p className="text-sm text-[#555555]">
                  3. Нажмите <strong>«Сохранить изменения»</strong>
                </p>
              </div>
            </div>

            {/* Просмотр товаров */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
                  <ChevronDown size={20} className="text-[#2E7D32]" />
                </div>
                <h3 className="text-[15px] font-semibold text-[#111111]">
                  Просмотр товаров в группе
                </h3>
              </div>
              <div className="ml-13 pl-3 border-l-2 border-[#E0E0E0] space-y-2">
                <p className="text-sm text-[#555555]">
                  Нажмите на строку группы, чтобы раскрыть/скрыть список товаров
                </p>
              </div>
            </div>

            {/* Добавление товаров */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
                  <Plus size={20} className="text-[#2E7D32]" />
                </div>
                <h3 className="text-[15px] font-semibold text-[#111111]">
                  Добавление товара
                </h3>
              </div>
              <div className="ml-13 pl-3 border-l-2 border-[#E0E0E0] space-y-2">
                <p className="text-sm text-[#555555]">
                  1. Нажмите кнопку <strong>«Добавить товар»</strong> в верхней части экрана
                </p>
                <p className="text-sm text-[#555555]">
                  2. Выберите группу из списка
                </p>
                <p className="text-sm text-[#555555]">
                  3. Заполните название и цену
                </p>
                <p className="text-sm text-[#555555]">
                  4. Нажмите <strong>«Добавить товар»</strong>
                </p>
              </div>
            </div>

            {/* Редактирование товаров */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
                  <Edit3 size={20} className="text-[#2E7D32]" />
                </div>
                <h3 className="text-[15px] font-semibold text-[#111111]">
                  Редактирование товара
                </h3>
              </div>
              <div className="ml-13 pl-3 border-l-2 border-[#E0E0E0] space-y-2">
                <p className="text-sm text-[#555555]">
                  1. Раскройте группу и нажмите на товар
                </p>
                <p className="text-sm text-[#555555]">
                  2. Измените название или цены
                </p>
                <p className="text-sm text-[#555555]">
                  3. Включите переключатель <strong>«Размеры S / M / L»</strong>, если нужны разные размеры
                </p>
                <p className="text-sm text-[#555555]">
                  4. Нажмите <strong>«Сохранить изменения»</strong> или иконку корзины для удаления
                </p>
              </div>
            </div>

            {/* Удаление */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFEBEE] flex items-center justify-center flex-shrink-0">
                  <Trash2 size={20} className="text-[#D32F2F]" />
                </div>
                <h3 className="text-[15px] font-semibold text-[#111111]">
                  Удаление элементов
                </h3>
              </div>
              <div className="ml-13 pl-3 border-l-2 border-[#E0E0E0] space-y-2">
                <p className="text-sm text-[#555555]">
                  <strong>Товары:</strong> откройте диалог редактирования и нажмите иконку корзины в правом верхнем углу
                </p>
                <p className="text-sm text-[#555555]">
                  <strong>Группы:</strong> можно удалить только пустые группы через диалог редактирования
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E0E0E0]">
              <div className="px-4 py-3 rounded-[10px] bg-[#E8E8FF] border border-[#1A1AFF]/20">
                <p className="text-xs text-[#1A1AFF] leading-relaxed">
                  <strong>Совет:</strong> Все изменения автоматически сохраняются. 
                  Вы можете изменить доступность товаров в разделе «Доступность» 
                  без изменения структуры меню.
                </p>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-[#E0E0E0] p-6">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              Понятно
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}