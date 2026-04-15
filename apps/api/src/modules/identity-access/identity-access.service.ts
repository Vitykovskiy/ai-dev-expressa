import { Inject, Injectable } from '@nestjs/common';

import {
  API_RUNTIME_ENV,
  type ApiRuntimeEnv,
} from '../../shared/config/runtime-env';
import {
  IDENTITY_ACCESS_REPOSITORY,
  type IdentityAccessRepository,
  type IdentityUserRecord,
} from './identity-access.types';

export interface SyncTelegramIdentityInput {
  displayName: string;
  telegramId: string;
}

const DEFAULT_MAIN_ADMINISTRATOR_NAME = 'Main Administrator';

@Injectable()
export class IdentityAccessService {
  constructor(
    @Inject(IDENTITY_ACCESS_REPOSITORY)
    private readonly identityAccessRepository: IdentityAccessRepository,
    @Inject(API_RUNTIME_ENV)
    private readonly runtimeEnv: ApiRuntimeEnv,
  ) {}

  bootstrapMainAdministrator(): Promise<IdentityUserRecord> {
    return this.identityAccessRepository.upsertTelegramUser({
      displayName: DEFAULT_MAIN_ADMINISTRATOR_NAME,
      ensureAdministrator: true,
      telegramId: this.runtimeEnv.adminTelegramId,
    });
  }

  syncTelegramIdentity(
    input: SyncTelegramIdentityInput,
  ): Promise<IdentityUserRecord> {
    return this.identityAccessRepository.upsertTelegramUser({
      displayName: input.displayName,
      ensureAdministrator: input.telegramId === this.runtimeEnv.adminTelegramId,
      telegramId: input.telegramId,
    });
  }
}
