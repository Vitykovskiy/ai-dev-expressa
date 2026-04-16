import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { BackofficeAccessChannel } from '@expressa/shared-types';
import type { BackofficeSession } from './model/backoffice-session';

@Injectable()
export class BackofficeSessionService {
  private readonly sessions = new Map<string, BackofficeSession>();

  createSession(input: {
    userId: string;
    channel: BackofficeAccessChannel;
    isTestMode: boolean;
  }): BackofficeSession {
    const session: BackofficeSession = {
      token: randomUUID(),
      userId: input.userId,
      channel: input.channel,
      isTestMode: input.isTestMode,
    };

    this.sessions.set(session.token, session);
    return session;
  }

  getSession(token: string): BackofficeSession | null {
    return this.sessions.get(token) ?? null;
  }
}

