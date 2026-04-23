import {
  DRINK_SIZES,
  type DrinkSizePrice,
  type MenuCatalogErrorCode,
  type MenuCategoryPayload,
  type MenuItemPayload,
  type OptionGroupPayload,
} from "@/modules/menu-catalog/types";

export interface ValidationResult {
  readonly valid: boolean;
  readonly message: string | null;
}

export function validateMenuCategoryPayload(
  payload: MenuCategoryPayload,
): ValidationResult {
  if (!payload.name.trim()) {
    return invalid("Введите название группы");
  }

  return valid();
}

export function validateMenuItemPayload(
  payload: MenuItemPayload,
): ValidationResult {
  if (!payload.name.trim()) {
    return invalid("Введите название товара");
  }

  if (!payload.menuCategoryId) {
    return invalid("Выберите группу");
  }

  if (payload.itemType === "regular") {
    if ((payload.drinkSizePrices?.length ?? 0) > 0) {
      return invalid("Отключите цены размеров для обычного товара");
    }

    if (!isNonNegativeMoney(payload.basePrice)) {
      return invalid("Укажите цену товара");
    }

    return valid();
  }

  const prices = payload.drinkSizePrices ?? [];
  const hasAllSizes = DRINK_SIZES.every((size) =>
    prices.some((price) => price.size === size && isPositiveMoney(price.price)),
  );

  if (!hasAllSizes) {
    return invalid("Укажите цены для размеров S, M и L");
  }

  return valid();
}

export function normalizeDrinkSizePrices(
  input: Record<string, string>,
): DrinkSizePrice[] {
  return DRINK_SIZES.map((size) => ({
    size,
    price: parseMoney(input[size] ?? ""),
  }));
}

export function validateOptionGroupPayload(
  payload: OptionGroupPayload,
): ValidationResult {
  if (!payload.name.trim()) {
    return invalid("Введите название группы опций");
  }

  if (
    payload.selectionMode !== "single" &&
    payload.selectionMode !== "multiple"
  ) {
    return invalid("Выберите тип выбора опций");
  }

  const hasInvalidOption = payload.options.some(
    (option) =>
      !option.name.trim() ||
      option.priceDelta < 0 ||
      !Number.isFinite(option.priceDelta),
  );

  if (hasInvalidOption) {
    return invalid("Укажите названия опций и неотрицательные доплаты");
  }

  return valid();
}

export function parseMoney(value: string): number {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) {
    return 0;
  }

  return Number(normalized);
}

export function formatMoney(value: number | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "";
  }

  return String(value);
}

export function mapMenuCatalogError(code: string | null): string {
  const knownCode = code as MenuCatalogErrorCode | null;
  switch (knownCode) {
    case "invalid-drink-size-model":
      return "Для напитка нужны цены S, M и L. Проверьте размерную модель.";
    case "invalid-option-group-rule":
      return "Проверьте тип выбора, состав опций и доплаты.";
    case "administrator-role-required":
    case "backoffice-capability-forbidden":
    case "backoffice-role-required":
      return "Недостаточно прав для управления меню.";
    case "backoffice-capability-not-found":
      return "Раздел управления меню недоступен.";
    case "backoffice-auth-failed":
    case "telegram-init-data-required":
    case "telegram-bot-token-required":
    case "telegram-hash-invalid":
    case "backoffice-user-not-found":
    case "user-blocked":
      return "Не удалось подтвердить вход в backoffice.";
    case "menu-catalog-request-failed":
      return "Не удалось выполнить запрос каталога.";
    default:
      return "Не удалось сохранить изменения каталога.";
  }
}

function isPositiveMoney(value: number | undefined): boolean {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isNonNegativeMoney(value: number | undefined): boolean {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function valid(): ValidationResult {
  return { valid: true, message: null };
}

function invalid(message: string): ValidationResult {
  return { valid: false, message };
}
