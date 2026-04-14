import type { MenuCatalogDto, SlotSettingsDto, SystemRole } from "@expressa/shared-types";

export interface UserRecord {
  userId: string;
  telegramId: string;
  roles: SystemRole[];
  blocked: boolean;
  isBootstrapAdministrator: boolean;
}

export interface NewUserRecord {
  telegramId: string;
  roles?: SystemRole[];
  blocked?: boolean;
  isBootstrapAdministrator?: boolean;
}

export interface UserRepository {
  findByTelegramId(telegramId: string): Promise<UserRecord | null>;
  create(input: NewUserRecord): Promise<UserRecord>;
  save(user: UserRecord): Promise<UserRecord>;
  list(): Promise<UserRecord[]>;
}

export interface MenuCatalogRepository {
  get(): Promise<MenuCatalogDto>;
  save(catalog: MenuCatalogDto): Promise<MenuCatalogDto>;
}

export interface SlotSettingsRepository {
  get(): Promise<SlotSettingsDto | null>;
  save(settings: SlotSettingsDto): Promise<SlotSettingsDto>;
}

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");
export const MENU_CATALOG_REPOSITORY = Symbol("MENU_CATALOG_REPOSITORY");
export const SLOT_SETTINGS_REPOSITORY = Symbol("SLOT_SETTINGS_REPOSITORY");

