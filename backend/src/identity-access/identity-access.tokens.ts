import { ConfigService } from "@nestjs/config";
import { AccessConfig } from "./config/access-config";
import { loadAccessConfig } from "./config/access-config";

export const ACCESS_CONFIG = Symbol("ACCESS_CONFIG");

export function provideAccessConfig(config: AccessConfig) {
  return {
    provide: ACCESS_CONFIG,
    useValue: config
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
        SERVICE_TELEGRAM_BOT_TOKEN: config.get<string>("SERVICE_TELEGRAM_BOT_TOKEN")
      })
  };
}
