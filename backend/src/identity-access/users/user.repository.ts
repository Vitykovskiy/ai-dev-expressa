import { AssignableRole } from "../domain/role";
import { User } from "../domain/user";

export interface UserListFilters {
  readonly search?: string;
  readonly role?: AssignableRole;
  readonly blocked?: boolean;
}

export interface UserListResult {
  readonly items: readonly User[];
  readonly total: number;
}

export interface UserRepository {
  findByTelegramId(telegramId: string): Promise<User | undefined>;
  findByUserId(userId: string): Promise<User | undefined>;
  list(filters: UserListFilters): Promise<UserListResult>;
  save(user: User): Promise<User>;
  clear(): Promise<void>;
}

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");
