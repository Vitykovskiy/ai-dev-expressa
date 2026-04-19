import { Module } from "@nestjs/common";
import { IdentityAccessModule } from "./identity-access/identity-access.module";
import { HealthController } from "./health.controller";

@Module({
  imports: [IdentityAccessModule],
  controllers: [HealthController]
})
export class AppModule {}
