import { Injectable } from '@nestjs/common';
import type { UserRecord } from '../models/user-record';

@Injectable()
export abstract class UserRepositoryPort {
  abstract findById(userId: string): Promise<UserRecord | null>;
  abstract findByTelegramId(telegramId: string): Promise<UserRecord | null>;
  abstract save(user: UserRecord): Promise<UserRecord>;
  abstract clearPrimaryAdministratorFlagExcept(telegramId: string): Promise<void>;
  abstract list(): Promise<UserRecord[]>;
}
