import { Injectable } from '@nestjs/common';
import type { UserRecord } from '../../domain/models/user-record';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';

@Injectable()
export class InMemoryUserRepository extends UserRepositoryPort {
  private readonly users = new Map<string, UserRecord>();

  async findById(userId: string): Promise<UserRecord | null> {
    return this.clone(this.users.get(userId) ?? null);
  }

  async findByTelegramId(telegramId: string): Promise<UserRecord | null> {
    const user = [...this.users.values()].find((candidate) => candidate.telegramId === telegramId) ?? null;
    return this.clone(user);
  }

  async save(user: UserRecord): Promise<UserRecord> {
    const normalized: UserRecord = {
      ...user,
      roles: [...new Set(user.roles)],
    };

    this.users.set(normalized.id, structuredClone(normalized));
    return this.clone(normalized) as UserRecord;
  }

  async clearPrimaryAdministratorFlagExcept(telegramId: string): Promise<void> {
    for (const [userId, user] of this.users.entries()) {
      if (user.telegramId !== telegramId && user.isPrimaryAdministrator) {
        this.users.set(userId, {
          ...user,
          isPrimaryAdministrator: false,
        });
      }
    }
  }

  async list(): Promise<UserRecord[]> {
    return [...this.users.values()].map((user) => this.clone(user) as UserRecord);
  }

  private clone<T>(value: T): T {
    return value === null ? value : structuredClone(value);
  }
}
