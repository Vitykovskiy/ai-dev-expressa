import {
  BookOpen,
  ClipboardList,
  Settings,
  ToggleRight,
  Users,
} from "lucide-vue-next";
import type { BackofficeCapability } from "../auth/types";

export interface BackofficeTab {
  readonly id: BackofficeCapability;
  readonly label: string;
  readonly path: string;
  readonly icon: unknown;
}

export const BACKOFFICE_TABS: readonly BackofficeTab[] = [
  { id: "orders", label: "Заказы", path: "/", icon: ClipboardList },
  {
    id: "availability",
    label: "Доступность",
    path: "/availability",
    icon: ToggleRight,
  },
  { id: "menu", label: "Меню", path: "/menu", icon: BookOpen },
  { id: "users", label: "Пользователи", path: "/users", icon: Users },
  { id: "settings", label: "Настройки", path: "/settings", icon: Settings },
];

export function getVisibleTabs(
  capabilities: readonly BackofficeCapability[],
): readonly BackofficeTab[] {
  return BACKOFFICE_TABS.filter((tab) => capabilities.includes(tab.id));
}
