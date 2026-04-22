import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Trash2 } from 'lucide-react';
import { Button } from './Button';
import { MenuItem } from '../types';
import { Switch } from './ui/switch';

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (productData: Partial<MenuItem>) => void;
  onDelete?: () => void;
  product: MenuItem | null;
  categoryName: string;
  categories: string[];
}

export function EditProductDialog({
  open,
  onOpenChange,
  onSave,
  onDelete,
  product,
  categoryName,
  categories,
}: EditProductDialogProps) {
  const [productName, setProductName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [hasSizes, setHasSizes] = useState(false);
  const [basePrice, setBasePrice] = useState('');
  const [sizes, setSizes] = useState<{ size: string; price: string }[]>([
    { size: 'S', price: '' },
    { size: 'M', price: '' },
    { size: 'L', price: '' },
  ]);

  useEffect(() => {
    if (product && open) {
      setProductName(product.name);
      setSelectedCategory(product.category);
      
      if (product.sizes && product.sizes.length > 0) {
        setHasSizes(true);
        const updatedSizes = sizes.map(s => {
          const existingSize = product.sizes?.find(ps => ps.size === s.size);
          return existingSize 
            ? { size: s.size, price: existingSize.price.toString() }
            : s;
        });
        setSizes(updatedSizes);
      } else {
        setHasSizes(false);
        setBasePrice(product.price?.toString() || '');
      }
    }
  }, [product, open]);

  const handleConfirm = () => {
    if (!productName.trim()) return;

    const updatedProduct: Partial<MenuItem> = {
      name: productName.trim(),
      category: selectedCategory,
    };

    if (hasSizes) {
      const validSizes = sizes
        .filter(s => s.price && parseFloat(s.price) > 0)
        .map(s => ({ size: s.size, price: parseFloat(s.price) }));
      
      if (validSizes.length > 0) {
        updatedProduct.sizes = validSizes;
        updatedProduct.price = undefined;
      }
    } else {
      if (basePrice && parseFloat(basePrice) > 0) {
        updatedProduct.price = parseFloat(basePrice);
        updatedProduct.sizes = undefined;
      }
    }

    onSave(updatedProduct);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onOpenChange(false);
    }
  };

  const isValid = productName.trim() && (
    (hasSizes && sizes.some(s => s.price && parseFloat(s.price) > 0)) ||
    (!hasSizes && basePrice && parseFloat(basePrice) > 0)
  );

  const handleSizeChange = (index: number, value: string) => {
    const newSizes = [...sizes];
    newSizes[index].price = value;
    setSizes(newSizes);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay 
          className="fixed inset-0 bg-[rgba(0,0,0,0.4)] z-50 animate-in fade-in duration-200" 
          onClick={handleCancel}
        />
        <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[16px] p-6 pb-safe z-50 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[16px] md:max-w-md md:w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom md:slide-in-from-top duration-200">
          <div className="flex items-center justify-between mb-2">
            <Dialog.Title className="text-lg font-semibold text-[#111111]">
              Редактировать товар
            </Dialog.Title>
            {onDelete && (
              <button
                onClick={handleDelete}
                className="p-2 -mr-2 rounded-lg hover:bg-[#FFEBEE] transition-colors"
                title="Удалить товар"
              >
                <Trash2 size={20} className="text-[#D32F2F]" />
              </button>
            )}
          </div>
          
          <Dialog.Description className="text-sm text-[#555555] mb-6">
            Категория: "{categoryName}"
          </Dialog.Description>

          <div className="space-y-5 mb-6">
            {/* Product Name */}
            <div>
              <label className="block text-[13px] font-medium text-[#555555] mb-1.5">
                Название товара
              </label>
              <input
                type="text"
                placeholder="Например: Капучино, Латте"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#1A1AFF]"
                autoFocus
              />
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-[13px] font-medium text-[#555555] mb-1.5">
                Категория
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#1A1AFF]"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sizes Toggle */}
            <div className="flex items-center justify-between py-3 border-b border-[#E0E0E0]">
              <div>
                <div className="text-[15px] font-semibold text-[#111111]">Размеры S / M / L</div>
                <div className="text-xs text-[#999999] mt-0.5">
                  Включить разные размеры с отдельными ценами
                </div>
              </div>
              <Switch
                checked={hasSizes}
                onCheckedChange={setHasSizes}
              />
            </div>

            {/* Prices */}
            {hasSizes ? (
              <div className="space-y-3">
                <label className="block text-[13px] font-medium text-[#555555]">
                  Цены по размерам, ₽
                </label>
                {sizes.map((sizeData, index) => (
                  <div key={sizeData.size} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F5F5F7] flex items-center justify-center text-sm font-semibold text-[#555555]">
                      {sizeData.size}
                    </div>
                    <input
                      type="number"
                      placeholder="0"
                      value={sizeData.price}
                      onChange={(e) => handleSizeChange(index, e.target.value)}
                      min="0"
                      step="0.01"
                      className="flex-1 px-3 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#1A1AFF]"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <label className="block text-[13px] font-medium text-[#555555] mb-1.5">
                  Цена, ₽
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2.5 rounded-[10px] border border-[#E0E0E0] text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#1A1AFF]"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleConfirm}
              disabled={!isValid}
            >
              Сохранить изменения
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