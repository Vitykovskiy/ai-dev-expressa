import type { UserRole } from '@expressa/shared-types';

export interface UserRecord {
  id: string;
  telegramId: string;
  roles: UserRole[];
  blocked: boolean;
  isPrimaryAdministrator: boolean;
}

