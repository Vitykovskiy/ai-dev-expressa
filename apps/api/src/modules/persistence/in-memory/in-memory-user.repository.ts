import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";

import { type NewUserRecord, type UserRecord, type UserRepository } from "../persistence.types";

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, UserRecord>();

  async findByTelegramId(telegramId: string): Promise<UserRecord | null> {
    return this.users.get(telegramId) ?? null;
  }

  async create(input: NewUserRecord): Promise<UserRecord> {
    const user: UserRecord = {
      userId: randomUUID(),
      telegramId: input.telegramId,
      roles: [...(input.roles ?? [])],
      blocked: input.blocked ?? false,
      isBootstrapAdministrator: input.isBootstrapAdministrator ?? false
    };

    this.users.set(user.telegramId, user);
    return { ...user, roles: [...user.roles] };
  }

  async save(user: UserRecord): Promise<UserRecord> {
    const snapshot = { ...user, roles: [...user.roles] };
    this.users.set(snapshot.telegramId, snapshot);
    return { ...snapshot, roles: [...snapshot.roles] };
  }

  async list(): Promise<UserRecord[]> {
    return [...this.users.values()]
      .map((user) => ({ ...user, roles: [...user.roles] }))
      .sort((left, right) => left.telegramId.localeCompare(right.telegramId));
  }
}

