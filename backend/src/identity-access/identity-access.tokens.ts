import { ConfigService } from "@nestjs/config";
import { AccessConfig } from "./config/access-config";
import { loadAccessConfig } from "./config/access-config";
import {
  loadUsersPostgresqlConfig,
  UsersPostgresqlConfig,
} from "./config/postgresql-config";

export const ACCESS_CONFIG = Symbol("ACCESS_CONFIG");
export const USERS_POSTGRESQL_CONFIG = Symbol("USERS_POSTGRESQL_CONFIG");

export function provideAccessConfig(config: AccessConfig) {
  return {
    provide: ACCESS_CONFIG,
    useValue: config,
  };
}

export function provideAccessConfigFromNestConfig() {
  return {
    provide: ACCESS_CONFIG,
    inject: [ConfigService],
    useFactory: (config: ConfigService) =>
      loadAccessConfig({
        NODE_ENV: config.get<string>("NODE_ENV"),
        ADMIN_TELEGRAM_ID: config.get<string>("ADMIN_TELEGRAM_ID"),
        DISABLE_TG_AUTH: config.get<string>("DISABLE_TG_AUTH"),
        SERVICE_TELEGRAM_BOT_TOKEN: config.get<string>(
          "SERVICE_TELEGRAM_BOT_TOKEN",
        ),
      }),
  };
}

export function provideUsersPostgresqlConfig(config: UsersPostgresqlConfig) {
  return {
    provide: USERS_POSTGRESQL_CONFIG,
    useValue: config,
  };
}

export function provideUsersPostgresqlConfigFromNestConfig() {
  return {
    provide: USERS_POSTGRESQL_CONFIG,
    inject: [ConfigService],
    useFactory: (config: ConfigService) =>
      loadUsersPostgresqlConfig({
        DATABASE_URL: config.get<string>("DATABASE_URL"),
      }),
  };
}
