import { Module } from "@nestjs/common";
import { BackofficeAuthGuard } from "./auth/backoffice-auth.guard";
import { BackofficeAuthService } from "./auth/backoffice-auth.service";
import { TelegramInitDataVerifier } from "./auth/telegram-init-data.verifier";
import { BootstrapAdministratorService } from "./bootstrap/bootstrap-administrator.service";
import { BackofficeController } from "./backoffice.controller";
import {
  provideAccessConfigFromNestConfig,
  provideUsersPostgresqlConfigFromNestConfig,
} from "./identity-access.tokens";
import { IdentityAccessService } from "./users/identity-access.service";
import { IdentityAccessPostgresqlClient } from "./users/postgresql/identity-access-postgresql.client";
import { PostgresqlUserRepository } from "./users/postgresql-user.repository";
import { USER_REPOSITORY } from "./users/user.repository";
import { UsersController } from "./users/users.controller";
import { UsersService } from "./users/users.service";

@Module({
  controllers: [UsersController, BackofficeController],
  providers: [
    provideAccessConfigFromNestConfig(),
    provideUsersPostgresqlConfigFromNestConfig(),
    IdentityAccessPostgresqlClient,
    {
      provide: USER_REPOSITORY,
      useClass: PostgresqlUserRepository,
    },
    IdentityAccessService,
    UsersService,
    BootstrapAdministratorService,
    TelegramInitDataVerifier,
    BackofficeAuthService,
    BackofficeAuthGuard,
  ],
  exports: [IdentityAccessService, BackofficeAuthService],
})
export class IdentityAccessModule {}
