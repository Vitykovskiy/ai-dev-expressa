import { Injectable, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ADMINISTRATOR_ROLE } from '../../domain/policies/backoffice-access.policy';
import type { UserRecord } from '../../domain/models/user-record';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { AccessEnvironmentService } from '../../infrastructure/config/access-environment.service';

@Injectable()
export class BootstrapMainAdministratorService implements OnModuleInit {
  constructor(
    private readonly environmentService: AccessEnvironmentService,
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ensureMainAdministrator();
  }

  async ensureMainAdministrator(): Promise<UserRecord> {
    const telegramId = this.environmentService.adminTelegramId;
    const existingUser = await this.userRepository.findByTelegramId(telegramId);

    await this.userRepository.clearPrimaryAdministratorFlagExcept(telegramId);

    if (existingUser) {
      return this.userRepository.save({
        ...existingUser,
        isPrimaryAdministrator: true,
        roles: [...new Set([...existingUser.roles, ADMINISTRATOR_ROLE])],
      });
    }

    return this.userRepository.save({
      id: randomUUID(),
      telegramId,
      roles: [ADMINISTRATOR_ROLE],
      blocked: false,
      isPrimaryAdministrator: true,
    });
  }
}
