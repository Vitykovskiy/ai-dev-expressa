import React, { useState } from 'react';
import { BookOpen, Coffee, ChevronDown, ChevronRight, Edit3 } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { EmptyState } from '../components/EmptyState';
import { MenuItem } from '../types';
import { AddCategoryDialog } from '../components/AddCategoryDialog';
import { AddProductDialog } from '../components/AddProductDialog';
import { EditCategoryDialog } from '../components/EditCategoryDialog';
import { EditProductDialog } from '../components/EditProductDialog';
import { Button } from '../components/Button';
import { toast } from 'sonner';

interface MenuScreenProps {
  menuItems: MenuItem[];
}

export function MenuScreen({ menuItems }: MenuScreenProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [showEditCategoryDialog, setShowEditCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [showEditProductDialog, setShowEditProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MenuItem | null>(null);

  // TODO: В будущем это должно храниться в state management
  // Временный список групп опций для демонстрации
  const [optionGroupsSet, setOptionGroupsSet] = useState<Set<string>>(new Set());

  // Разделяем категории на обычные и группы опций
  const allCategories = Array.from(new Set(menuItems.map(item => item.category)));
  const regularCategories = allCategories.filter(category => {
    const items = menuItems.filter(item => item.category === category);
    return !items.some(item => item.isOptionGroup);
  });
  const optionCategories = allCategories.filter(category => {
    const items = menuItems.filter(item => item.category === category);
    return items.some(item => item.isOptionGroup);
  });

  const categories = allCategories;
  const optionGroups = Array.from(optionGroupsSet);

  const getCategoryCount = (category: string) => {
    return menuItems.filter(item => item.category === category).length;
  };

  const getCategoryProducts = (category: string) => {
    return menuItems.filter(item => item.category === category);
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddCategory = (categoryName: string, isOptionGroup: boolean, parentGroupId?: string) => {
    console.log('Добавление категории:', categoryName, { isOptionGroup, parentGroupId });
    toast.success(`Категория "${categoryName}" добавлена`);
    // Здесь должна быть логика добавления категории в store
    if (isOptionGroup) {
      setOptionGroupsSet(prev => new Set([...prev, categoryName]));
    }
  };

  const handleEditCategory = (category: string) => {
    setEditingCategory(category);
    setShowEditCategoryDialog(true);
  };

  const handleSaveCategory = (newName: string, isOptionGroup: boolean, parentGroupId?: string) => {
    if (editingCategory) {
      console.log('Переименование категории:', editingCategory, 'в', newName, { isOptionGroup, parentGroupId });
      toast.success(`Категория переименована в "${newName}"`);
      // Здесь должна быть логика обновления категории в store
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = () => {
    if (editingCategory) {
      console.log('Удаление категории:', editingCategory);
      toast.success(`Категория "${editingCategory}" удалена`);
      // Здесь должна быть логика удаления категории из store
      setEditingCategory(null);
    }
  };

  const handleAddProduct = (productData: { 
    name: string; 
    category: string;
    price?: number;
    sizes?: { size: string; price: number }[];
  }) => {
    console.log('Добавление товара:', productData);
    toast.success(`Товар "${productData.name}" добавлен в категорию "${productData.category}"`);
    // Здесь должна быть логика добавления товара в store
  };

  const handleEditProduct = (product: MenuItem) => {
    setEditingProduct(product);
    setShowEditProductDialog(true);
  };

  const handleSaveProduct = (productData: Partial<MenuItem>) => {
    if (editingProduct) {
      console.log('Сохранение товара:', editingProduct.id, productData);
      toast.success('Товар обновлён');
      // Здесь должна быть логика обновления товара в store
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = () => {
    if (editingProduct) {
      console.log('Удаление товара:', editingProduct.id);
      toast.success(`Товар "${editingProduct.name}" удалён`);
      // Здесь должна быть логика удаления товара из store
      setEditingProduct(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F5F5F7] md:bg-white h-full overflow-hidden">
      <TopBar title="Меню" />

      <div className="md:px-6 md:pt-6">
        <div className="hidden md:flex md:items-center md:justify-between mb-4">
          <h1 className="text-2xl font-bold text-[#111111]">Меню</h1>
          {categories.length > 0 && (
            <span className="text-sm text-[#999999]">
              {regularCategories.length > 0 && `${regularCategories.length} ${regularCategories.length === 1 ? 'группа' : 'групп'}`}
              {regularCategories.length > 0 && optionCategories.length > 0 && ' · '}
              {optionCategories.length > 0 && `${optionCategories.length} ${optionCategories.length === 1 ? 'группа опций' : 'групп опций'}`}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-4 md:px-0 pt-4 md:pt-0 pb-3 flex gap-2">
          <Button
            variant="primary"
            className="flex-1 md:flex-initial"
            onClick={() => setShowAddCategoryDialog(true)}
          >
            Добавить группу
          </Button>
          <div className="flex-1 md:flex-initial relative group">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setShowAddProductDialog(true)}
              disabled={categories.length === 0}
            >
              Добавить товар
            </Button>
            {categories.length === 0 && (
              <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#111111] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Сначала создайте группу
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#111111]" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:pb-6 pb-20 md:pb-6 space-y-6">
        {categories.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Меню пусто"
            subtitle="Добавьте первую группу для начала работы"
          />
        ) : (
          <>
            {/* Regular Categories Table */}
            {regularCategories.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-[#999999] uppercase tracking-wider mb-3 px-1">
                  Основное меню
                </h2>
                <div className="bg-white border border-[#E0E0E0] rounded-[16px] overflow-hidden">
                  {regularCategories.map((category, categoryIndex) => {
                    const products = getCategoryProducts(category);
                    const isExpanded = expandedCategories.has(category);

                    return (
                      <div
                        key={category}
                        className={categoryIndex !== regularCategories.length - 1 ? 'border-b border-[#E0E0E0]' : ''}
                      >
                        {/* Category Header */}
                        <div className="flex items-center bg-[#F5F5F7] hover:bg-[#ECECEC] transition-colors">
                          <button
                            onClick={() => toggleCategory(category)}
                            className="flex-1 flex items-center gap-3 px-4 py-3.5"
                          >
                            <div className="text-[#555555]">
                              {isExpanded ? (
                                <ChevronDown size={20} />
                              ) : (
                                <ChevronRight size={20} />
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-[15px] font-semibold text-[#111111]">{category}</div>
                              <div className="text-xs text-[#999999] mt-0.5">
                                {getCategoryCount(category)} {getCategoryCount(category) === 1 ? 'товар' : 'товаров'}
                              </div>
                            </div>
                          </button>
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="px-4 py-3.5 hover:bg-[#E8E8FF] transition-colors"
                            title="Редактировать группу"
                          >
                            <Edit3 size={18} className="text-[#1A1AFF]" />
                          </button>
                        </div>

                        {/* Products List */}
                        {isExpanded && (
                          <div className="bg-white animate-in slide-in-from-top-2 duration-200">
                            {products.length === 0 ? (
                              <div className="px-4 py-8 text-center border-t border-[#E0E0E0]">
                                <Coffee size={32} className="mx-auto text-[#999999] mb-2" />
                                <p className="text-sm text-[#999999]">Товаров в этой группе пока нет</p>
                              </div>
                            ) : (
                              products.map((product, productIndex) => (
                                <button
                                  key={product.id}
                                  onClick={() => handleEditProduct(product)}
                                  className="w-full flex items-center gap-3 px-4 pl-12 py-3 hover:bg-[#F5F5F7] transition-colors border-t border-[#E0E0E0]"
                                >
                                  <div className="flex-1 text-left">
                                    <div className="text-sm font-semibold text-[#111111]">{product.name}</div>
                                    <div className="text-xs text-[#999999] mt-0.5">
                                      {product.sizes && product.sizes.length > 0
                                        ? product.sizes.map(s => `${s.size}: ${s.price} ₽`).join(' · ')
                                        : product.price !== undefined
                                        ? `${product.price} ₽`
                                        : 'Нет цены'}
                                    </div>
                                  </div>
                                  <ChevronRight size={18} className="text-[#999999]" />
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Option Groups Table */}
            {optionCategories.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-[#999999] uppercase tracking-wider mb-3 px-1">
                  Группы опций
                </h2>
                <div className="bg-white border border-[#E0E0E0] rounded-[16px] overflow-hidden">
                  {optionCategories.map((category, categoryIndex) => {
                    const products = getCategoryProducts(category);
                    const isExpanded = expandedCategories.has(category);

                    return (
                      <div
                        key={category}
                        className={categoryIndex !== optionCategories.length - 1 ? 'border-b border-[#E0E0E0]' : ''}
                      >
                        {/* Category Header */}
                        <div className="flex items-center bg-[#F5F5F7] hover:bg-[#ECECEC] transition-colors">
                          <button
                            onClick={() => toggleCategory(category)}
                            className="flex-1 flex items-center gap-3 px-4 py-3.5"
                          >
                            <div className="text-[#555555]">
                              {isExpanded ? (
                                <ChevronDown size={20} />
                              ) : (
                                <ChevronRight size={20} />
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-[15px] font-semibold text-[#111111]">{category}</div>
                              <div className="text-xs text-[#999999] mt-0.5">
                                {getCategoryCount(category)} {getCategoryCount(category) === 1 ? 'опция' : 'опций'}
                              </div>
                            </div>
                          </button>
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="px-4 py-3.5 hover:bg-[#E8E8FF] transition-colors"
                            title="Редактировать группу"
                          >
                            <Edit3 size={18} className="text-[#1A1AFF]" />
                          </button>
                        </div>

                        {/* Products List */}
                        {isExpanded && (
                          <div className="bg-white animate-in slide-in-from-top-2 duration-200">
                            {products.length === 0 ? (
                              <div className="px-4 py-8 text-center border-t border-[#E0E0E0]">
                                <Coffee size={32} className="mx-auto text-[#999999] mb-2" />
                                <p className="text-sm text-[#999999]">Опций в этой группе пока нет</p>
                              </div>
                            ) : (
                              products.map((product, productIndex) => (
                                <button
                                  key={product.id}
                                  onClick={() => handleEditProduct(product)}
                                  className="w-full flex items-center gap-3 px-4 pl-12 py-3 hover:bg-[#F5F5F7] transition-colors border-t border-[#E0E0E0]"
                                >
                                  <div className="flex-1 text-left">
                                    <div className="text-sm font-semibold text-[#111111]">{product.name}</div>
                                    <div className="text-xs text-[#999999] mt-0.5">
                                      {product.sizes && product.sizes.length > 0
                                        ? product.sizes.map(s => `${s.size}: ${s.price} ₽`).join(' · ')
                                        : product.price !== undefined
                                        ? product.price === 0 ? 'Бесплатно' : `${product.price} ₽`
                                        : 'Нет цены'}
                                    </div>
                                  </div>
                                  <ChevronRight size={18} className="text-[#999999]" />
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AddCategoryDialog
        open={showAddCategoryDialog}
        onOpenChange={setShowAddCategoryDialog}
        onConfirm={handleAddCategory}
        categories={categories}
        optionGroups={optionGroups}
      />

      <AddProductDialog
        open={showAddProductDialog}
        onOpenChange={setShowAddProductDialog}
        onConfirm={handleAddProduct}
        categories={categories}
      />

      <EditCategoryDialog
        open={showEditCategoryDialog}
        onOpenChange={setShowEditCategoryDialog}
        onSave={handleSaveCategory}
        onDelete={handleDeleteCategory}
        categoryName={editingCategory}
        productCount={editingCategory ? getCategoryCount(editingCategory) : 0}
        categories={categories}
        optionGroups={optionGroups}
      />

      <EditProductDialog
        open={showEditProductDialog}
        onOpenChange={setShowEditProductDialog}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
        product={editingProduct}
        categoryName={editingProduct?.category || ''}
        categories={categories}
      />
    </div>
  );
}