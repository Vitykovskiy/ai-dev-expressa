import type { BackofficeAccessChannel } from '@expressa/shared-types';

export interface BackofficeSession {
  token: string;
  userId: string;
  channel: BackofficeAccessChannel;
  isTestMode: boolean;
}
