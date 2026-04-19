import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { join } from "node:path";
import { IdentityAccessModule } from "./identity-access/identity-access.module";
import { HealthController } from "./health.controller";
import { MenuCatalogModule } from "./menu-catalog/menu-catalog.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, "..", "..", ".env"),
      isGlobal: true,
    }),
    IdentityAccessModule,
    MenuCatalogModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
