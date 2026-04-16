import { Module } from '@nestjs/common';
import { AccessController } from './access.controller';
import { AdministratorGuard } from './administrator.guard';
import { BackofficeAccessService } from './backoffice-access.service';
import { BackofficeSessionGuard } from './backoffice-session.guard';
import { BackofficeSessionService } from './backoffice-session.service';
import { BootstrapMainAdministratorService } from './bootstrap-main-administrator.service';
import { EnvironmentService } from './environment.service';
import { InMemoryUserRepository } from './in-memory-user.repository';
import { TelegramWebAppValidatorService } from './telegram-webapp-validator.service';
import { USER_REPOSITORY, UserRepositoryPort } from './user-repository';

@Module({
  controllers: [AccessController],
  providers: [
    AdministratorGuard,
    BackofficeAccessService,
    BackofficeSessionGuard,
    BackofficeSessionService,
    BootstrapMainAdministratorService,
    EnvironmentService,
    InMemoryUserRepository,
    TelegramWebAppValidatorService,
    {
      provide: USER_REPOSITORY,
      useExisting: InMemoryUserRepository,
    },
    {
      provide: UserRepositoryPort,
      useExisting: InMemoryUserRepository,
    },
  ],
})
export class AccessModule {}
