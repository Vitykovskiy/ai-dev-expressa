import type { BackofficeAccessChannel, BackofficeTab, UserRole } from '@expressa/shared-types';

export interface BackofficeSession {
  token: string;
  userId: string;
  channel: BackofficeAccessChannel;
  isTestMode: boolean;
}

export interface ResolvedBackofficeContext {
  accessToken: string;
  channel: BackofficeAccessChannel;
  isTestMode: boolean;
  user: {
    userId: string;
    telegramId: string;
    roles: UserRole[];
    blocked: boolean;
    isPrimaryAdministrator: boolean;
  };
  availableTabs: BackofficeTab[];
}

