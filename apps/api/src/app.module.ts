import { Module } from "@nestjs/common";

import { AppConfigModule } from "./config/app-config.module";
import { AuthSessionModule } from "./modules/auth-session/auth-session.module";
import { IdentityAccessModule } from "./modules/identity-access/identity-access.module";
import { MenuCatalogModule } from "./modules/menu-catalog/menu-catalog.module";
import { PersistenceModule } from "./modules/persistence/persistence.module";
import { SlotSettingsModule } from "./modules/slot-settings/slot-settings.module";

@Module({
  imports: [
    AppConfigModule,
    PersistenceModule.register(),
    AuthSessionModule,
    IdentityAccessModule,
    MenuCatalogModule,
    SlotSettingsModule
  ]
})
export class AppModule {}
