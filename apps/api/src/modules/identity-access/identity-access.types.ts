import type { UserRole } from '@expressa/shared-types' with {
  "resolution-mode": "import"
};

export interface IdentityUserRecord {
  blocked: boolean;
  displayName: string;
  roles: UserRole[];
  telegramId: string;
  userId: string;
}

export interface UpsertIdentityUserInput {
  displayName: string;
  ensureAdministrator: boolean;
  telegramId: string;
}

export interface IdentityAccessRepository {
  upsertTelegramUser(
    input: UpsertIdentityUserInput,
  ): Promise<IdentityUserRecord>;
}

export const IDENTITY_ACCESS_REPOSITORY = Symbol('IDENTITY_ACCESS_REPOSITORY');
