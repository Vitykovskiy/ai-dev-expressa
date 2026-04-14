import { Global, Module } from "@nestjs/common";

import { APP_CONFIG, getAppConfig } from "./app-config";

@Global()
@Module({
  providers: [
    {
      provide: APP_CONFIG,
      useFactory: () => getAppConfig(process.env)
    }
  ],
  exports: [APP_CONFIG]
})
export class AppConfigModule {}

