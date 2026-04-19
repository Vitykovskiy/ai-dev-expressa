import { Inject, Injectable } from "@nestjs/common";
import { Role } from "../domain/role";
import { createUser, User, withRoles } from "../domain/user";
import { USER_REPOSITORY, UserRepository } from "./user.repository";

@Injectable()
export class IdentityAccessService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository
  ) {}

  async findByTelegramId(telegramId: string): Promise<User | undefined> {
    return this.users.findByTelegramId(telegramId);
  }

  async ensureUserWithRoles(telegramId: string, roles: readonly Role[]): Promise<User> {
    const existing = await this.users.findByTelegramId(telegramId);
    if (existing) {
      return this.users.save(withRoles(existing, roles));
    }

    return this.users.save(createUser({ telegramId, roles }));
  }
}
