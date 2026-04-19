import { Module } from "@nestjs/common";
import { BackofficeAuthGuard } from "./auth/backoffice-auth.guard";
import { BackofficeAuthService } from "./auth/backoffice-auth.service";
import { TelegramInitDataVerifier } from "./auth/telegram-init-data.verifier";
import { BootstrapAdministratorService } from "./bootstrap/bootstrap-administrator.service";
import { BackofficeController } from "./backoffice.controller";
import { provideAccessConfigFromNestConfig } from "./identity-access.tokens";
import { InMemoryUserRepository } from "./users/in-memory-user.repository";
import { IdentityAccessService } from "./users/identity-access.service";
import { USER_REPOSITORY } from "./users/user.repository";

@Module({
  controllers: [BackofficeController],
  providers: [
    provideAccessConfigFromNestConfig(),
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    },
    IdentityAccessService,
    BootstrapAdministratorService,
    TelegramInitDataVerifier,
    BackofficeAuthService,
    BackofficeAuthGuard,
  ],
  exports: [IdentityAccessService, BackofficeAuthService],
})
export class IdentityAccessModule {}
