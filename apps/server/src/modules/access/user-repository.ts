import { Injectable } from '@nestjs/common';
import type { UserRecord } from './model/user-record';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  findById(userId: string): Promise<UserRecord | null>;
  findByTelegramId(telegramId: string): Promise<UserRecord | null>;
  save(user: UserRecord): Promise<UserRecord>;
  clearPrimaryAdministratorFlagExcept(telegramId: string): Promise<void>;
  list(): Promise<UserRecord[]>;
}

@Injectable()
export abstract class UserRepositoryPort implements UserRepository {
  abstract findById(userId: string): Promise<UserRecord | null>;
  abstract findByTelegramId(telegramId: string): Promise<UserRecord | null>;
  abstract save(user: UserRecord): Promise<UserRecord>;
  abstract clearPrimaryAdministratorFlagExcept(telegramId: string): Promise<void>;
  abstract list(): Promise<UserRecord[]>;
}

