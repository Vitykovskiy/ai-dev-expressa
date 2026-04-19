import { type MenuItem, type SelectionMode } from "./types";

export function itemPriceLabel(item: MenuItem): string {
  if (item.itemType === "drink") {
    const prices = item.drinkSizePrices ?? [];
    const minPrice = Math.min(...prices.map((price) => price.price));
    return Number.isFinite(minPrice) ? `от ${minPrice} ₽` : "Нет цены";
  }

  return typeof item.basePrice === "number" ? `${item.basePrice} ₽` : "Нет цены";
}

export function selectionModeLabel(mode: SelectionMode): string {
  return mode === "single" ? "Один вариант" : "Несколько вариантов";
}

export function categoryCountLabel(count: number): string {
  return `${count} ${count === 1 ? "группа" : "групп"}`;
}

export function itemCountLabel(count: number): string {
  return `${count} ${count === 1 ? "товар" : "товаров"}`;
}
