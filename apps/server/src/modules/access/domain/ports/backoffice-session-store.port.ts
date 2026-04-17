import { Injectable } from '@nestjs/common';
import type { BackofficeAccessChannel } from '@expressa/shared-types';
import type { BackofficeSession } from '../models/backoffice-session';

@Injectable()
export abstract class BackofficeSessionStorePort {
  abstract createSession(input: {
    userId: string;
    channel: BackofficeAccessChannel;
    isTestMode: boolean;
  }): Promise<BackofficeSession>;

  abstract getSession(token: string): Promise<BackofficeSession | null>;
}
