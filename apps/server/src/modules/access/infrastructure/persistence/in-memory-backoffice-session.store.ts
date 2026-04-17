import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { BackofficeAccessChannel } from '@expressa/shared-types';
import type { BackofficeSession } from '../../domain/models/backoffice-session';
import { BackofficeSessionStorePort } from '../../domain/ports/backoffice-session-store.port';

@Injectable()
export class InMemoryBackofficeSessionStore extends BackofficeSessionStorePort {
  private readonly sessions = new Map<string, BackofficeSession>();

  async createSession(input: {
    userId: string;
    channel: BackofficeAccessChannel;
    isTestMode: boolean;
  }): Promise<BackofficeSession> {
    const session: BackofficeSession = {
      token: randomUUID(),
      userId: input.userId,
      channel: input.channel,
      isTestMode: input.isTestMode,
    };

    this.sessions.set(session.token, session);
    return session;
  }

  async getSession(token: string): Promise<BackofficeSession | null> {
    return this.sessions.get(token) ?? null;
  }
}
