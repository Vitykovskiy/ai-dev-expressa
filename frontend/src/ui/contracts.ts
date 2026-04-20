import type { BackofficeCapability } from "../modules/auth/types";

export const APP_BREAKPOINTS = {
  tablet: 960,
} as const;

export const APP_BUTTON_VARIANTS = {
  primary: {
    color: "primary",
    variant: "flat",
    className: "app-button--primary",
  },
  secondary: {
    color: "secondary",
    variant: "flat",
    className: "app-button--secondary",
  },
  outlined: {
    color: "secondary-text",
    variant: "outlined",
    className: "app-button--outlined",
  },
  destructive: {
    color: "error",
    variant: "flat",
    className: "app-button--destructive",
  },
  ghost: {
    color: "secondary-text",
    variant: "text",
    className: "app-button--ghost",
  },
  tonal: {
    color: "primary",
    variant: "tonal",
    className: "app-button--tonal",
  },
} as const;

export type AppButtonVariant = keyof typeof APP_BUTTON_VARIANTS;

export const APP_STATUS_BADGE_VARIANTS = {
  Created: {
    background: "var(--app-color-accent-light)",
    color: "var(--app-color-accent)",
  },
  Confirmed: {
    background: "var(--app-color-success-light)",
    color: "var(--app-color-success)",
  },
  "Ready for pickup": {
    background: "var(--app-color-warning-light)",
    color: "var(--app-color-warning)",
  },
  Rejected: {
    background: "var(--app-color-destructive-light)",
    color: "var(--app-color-destructive)",
  },
  Closed: {
    background: "var(--app-color-neutral-light)",
    color: "var(--app-color-neutral)",
  },
} as const;

export type AppStatusBadgeVariant = keyof typeof APP_STATUS_BADGE_VARIANTS;

export const APP_ROLE_LABELS: Record<BackofficeCapability, string> = {
  orders: "Заказы",
  availability: "Доступность",
  menu: "Меню",
  users: "Пользователи",
  settings: "Настройки",
};

export function resolveButtonVariant(variant: AppButtonVariant) {
  return APP_BUTTON_VARIANTS[variant];
}

export function resolveStatusBadgeVariant(variant: AppStatusBadgeVariant) {
  return APP_STATUS_BADGE_VARIANTS[variant];
}
