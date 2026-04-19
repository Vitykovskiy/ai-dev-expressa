import { Injectable } from "@nestjs/common";
import { User } from "../domain/user";
import { UserRepository } from "./user.repository";

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private readonly usersByTelegramId = new Map<string, User>();

  async findByTelegramId(telegramId: string): Promise<User | undefined> {
    return this.usersByTelegramId.get(telegramId);
  }

  async save(user: User): Promise<User> {
    this.usersByTelegramId.set(user.telegramId, user);
    return user;
  }

  async clear(): Promise<void> {
    this.usersByTelegramId.clear();
  }
}
