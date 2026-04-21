import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant?: 'primary' | 'destructive';
  onConfirm: (reason?: string) => void;
  requireInput?: boolean;
  inputPlaceholder?: string;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  confirmVariant = 'primary',
  onConfirm,
  requireInput = false,
  inputPlaceholder = '',
}: ConfirmDialogProps) {
  const [inputValue, setInputValue] = useState('');

  const handleConfirm = () => {
    onConfirm(requireInput ? inputValue : undefined);
    setInputValue('');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setInputValue('');
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[rgba(0,0,0,0.4)] z-50" />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[16px] p-6 pb-safe z-50 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[16px] md:max-w-md md:w-full">
          <Dialog.Title className="text-lg font-semibold text-[#111111] mb-2">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-[#555555] mb-4">
            {description}
          </Dialog.Description>

          {requireInput && (
            <input
              type="text"
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3 py-3 mb-4 rounded-[10px] border border-[#E0E0E0] text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#1A1AFF]/20"
            />
          )}

          <div className="flex flex-col gap-2">
            <Button
              variant={confirmVariant}
              className="w-full"
              onClick={handleConfirm}
              disabled={requireInput && !inputValue.trim()}
            >
              {confirmLabel}
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
