export type PersistenceDriver = "memory" | "prisma";
export type AdministratorPromotionMode = "bootstrap-only" | "any-administrator";

export interface AppConfig {
  adminTelegramId: string;
  disableTelegramAuth: boolean;
  backofficeBotToken: string | null;
  persistenceDriver: PersistenceDriver;
  administratorPromotionMode: AdministratorPromotionMode;
}

export const APP_CONFIG = Symbol("APP_CONFIG");

const parseBoolean = (value: string | undefined, fallback = false): boolean => {
  if (value === undefined) {
    return fallback;
  }

  return value === "1" || value.toLowerCase() === "true";
};

export const getAppConfig = (env: NodeJS.ProcessEnv): AppConfig => {
  const adminTelegramId = env.ADMIN_TELEGRAM_ID?.trim();

  if (!adminTelegramId) {
    throw new Error("ADMIN_TELEGRAM_ID is required");
  }

  const persistenceDriverEnv = env.PERSISTENCE_DRIVER?.trim();
  const persistenceDriver: PersistenceDriver =
    persistenceDriverEnv === "memory" || persistenceDriverEnv === "prisma"
      ? persistenceDriverEnv
      : env.NODE_ENV === "test"
        ? "memory"
        : "prisma";

  const administratorPromotionModeEnv = env.ADMINISTRATOR_PROMOTION_MODE?.trim();
  const administratorPromotionMode: AdministratorPromotionMode =
    administratorPromotionModeEnv === "any-administrator"
      ? "any-administrator"
      : "bootstrap-only";

  return {
    adminTelegramId,
    disableTelegramAuth: parseBoolean(env.DISABLE_TG_AUTH),
    backofficeBotToken: env.TG_BACKOFFICE_BOT_TOKEN?.trim() ?? null,
    persistenceDriver,
    administratorPromotionMode
  };
};

