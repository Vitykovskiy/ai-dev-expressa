import { User } from "../domain/user";

export interface UserRepository {
  list(): Promise<User[]>;
  findByUserId(userId: string): Promise<User | undefined>;
  findByTelegramId(telegramId: string): Promise<User | undefined>;
  save(user: User): Promise<User>;
  clear(): Promise<void>;
}

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");
