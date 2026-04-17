import { Module } from '@nestjs/common';
import { BackofficeAccessService } from './application/services/backoffice-access.service';
import { BootstrapMainAdministratorService } from './application/services/bootstrap-main-administrator.service';
import { BackofficeSessionStorePort } from './domain/ports/backoffice-session-store.port';
import { UserRepositoryPort } from './domain/ports/user-repository.port';
import { TelegramWebAppValidatorService } from './infrastructure/adapters/telegram-webapp-validator.service';
import { AccessEnvironmentService } from './infrastructure/config/access-environment.service';
import { InMemoryBackofficeSessionStore } from './infrastructure/persistence/in-memory-backoffice-session.store';
import { InMemoryUserRepository } from './infrastructure/persistence/in-memory-user.repository';
import { AccessController } from './transport/controllers/access.controller';
import { AdministratorGuard } from './transport/guards/administrator.guard';
import { BackofficeSessionGuard } from './transport/guards/backoffice-session.guard';

@Module({
  controllers: [AccessController],
  providers: [
    AdministratorGuard,
    BackofficeAccessService,
    BackofficeSessionGuard,
    BootstrapMainAdministratorService,
    AccessEnvironmentService,
    InMemoryBackofficeSessionStore,
    InMemoryUserRepository,
    TelegramWebAppValidatorService,
    {
      provide: BackofficeSessionStorePort,
      useExisting: InMemoryBackofficeSessionStore,
    },
    {
      provide: UserRepositoryPort,
      useExisting: InMemoryUserRepository,
    },
  ],
  exports: [AdministratorGuard, BackofficeAccessService, BackofficeSessionGuard],
})
export class AccessModule {}
