import { Injectable } from "@nestjs/common";
import { User } from "../domain/user";
import {
  UserListFilters,
  UserListResult,
  UserRepository,
} from "./user.repository";

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private readonly usersById = new Map<string, User>();
  private readonly userIdsByTelegramId = new Map<string, string>();

  async findByTelegramId(telegramId: string): Promise<User | undefined> {
    const userId = this.userIdsByTelegramId.get(telegramId);
    return userId ? this.usersById.get(userId) : undefined;
  }

  async findByUserId(userId: string): Promise<User | undefined> {
    return this.usersById.get(userId);
  }

  async list(filters: UserListFilters): Promise<UserListResult> {
    const normalizedSearch = filters.search?.trim().toLowerCase();
    const items = [...this.usersById.values()].filter((user) => {
      if (
        normalizedSearch &&
        !user.displayName.toLowerCase().includes(normalizedSearch) &&
        !user.telegramUsername.toLowerCase().includes(normalizedSearch)
      ) {
        return false;
      }

      if (filters.role && !user.roles.includes(filters.role)) {
        return false;
      }

      if (
        typeof filters.blocked === "boolean" &&
        user.blocked !== filters.blocked
      ) {
        return false;
      }

      return true;
    });

    items.sort((left, right) => {
      const byName = left.displayName.localeCompare(right.displayName);
      if (byName !== 0) {
        return byName;
      }

      return left.userId.localeCompare(right.userId);
    });

    return {
      items,
      total: items.length,
    };
  }

  async save(user: User): Promise<User> {
    const previous = this.usersById.get(user.userId);
    if (previous) {
      this.userIdsByTelegramId.delete(previous.telegramId);
    }

    this.usersById.set(user.userId, user);
    this.userIdsByTelegramId.set(user.telegramId, user.userId);
    return user;
  }

  async clear(): Promise<void> {
    this.usersById.clear();
    this.userIdsByTelegramId.clear();
  }
}
