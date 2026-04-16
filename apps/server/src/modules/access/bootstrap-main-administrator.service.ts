import { Injectable, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ADMINISTRATOR_ROLE } from './access.constants';
import { EnvironmentService } from './environment.service';
import type { UserRecord } from './model/user-record';
import { UserRepositoryPort } from './user-repository';

@Injectable()
export class BootstrapMainAdministratorService implements OnModuleInit {
  constructor(
    private readonly environmentService: EnvironmentService,
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

