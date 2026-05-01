import { Injectable } from "@nestjs/common";
import { User } from "../domain/user";
import { UserRepository } from "./user.repository";

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private readonly usersByUserId = new Map<string, User>();
  private readonly usersByTelegramId = new Map<string, User>();

  async list(): Promise<User[]> {
    return [...this.usersByUserId.values()];
  }

  async findByUserId(userId: string): Promise<User | undefined> {
    return this.usersByUserId.get(userId);
  }

  async findByTelegramId(telegramId: string): Promise<User | undefined> {
    return this.usersByTelegramId.get(telegramId);
  }

  async save(user: User): Promise<User> {
    const existing = this.usersByTelegramId.get(user.telegramId);
    if (existing && existing.userId !== user.userId) {
      this.usersByUserId.delete(existing.userId);
    }

    const existingByUserId = this.usersByUserId.get(user.userId);
    if (existingByUserId && existingByUserId.telegramId !== user.telegramId) {
      this.usersByTelegramId.delete(existingByUserId.telegramId);
    }

    this.usersByUserId.set(user.userId, user);
    this.usersByTelegramId.set(user.telegramId, user);
    return user;
  }

  async clear(): Promise<void> {
    this.usersByUserId.clear();
    this.usersByTelegramId.clear();
  }
}
