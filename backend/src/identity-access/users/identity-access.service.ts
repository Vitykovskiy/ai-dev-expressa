import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  Optional,
} from "@nestjs/common";
import { AccessConfig } from "../config/access-config";
import { AuthenticatedActor } from "../domain/authenticated-actor";
import {
  BackofficeCapability,
  canAccessBackofficeCapability,
  isAssignableBackofficeRole,
  Role,
  visibleBackofficeCapabilities,
} from "../domain/role";
import {
  createUser,
  User,
  withAssignedBackofficeRole,
  withRoles,
} from "../domain/user";
import { ACCESS_CONFIG } from "../identity-access.tokens";
import { USER_REPOSITORY, UserRepository } from "./user.repository";

export interface BackofficeManagedUser {
  readonly userId: string;
  readonly telegramId: string;
  readonly roles: readonly Role[];
  readonly blocked: boolean;
  readonly displayLabel?: string;
  readonly capabilities: readonly BackofficeCapability[];
}

@Injectable()
export class IdentityAccessService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
    @Inject(ACCESS_CONFIG)
    @Optional()
    private readonly config?: AccessConfig,
  ) {}

  async findByTelegramId(telegramId: string): Promise<User | undefined> {
    return this.users.findByTelegramId(telegramId);
  }

  async listManagedUsers(): Promise<BackofficeManagedUser[]> {
    const users = await this.users.list();
    return users.map(toBackofficeManagedUser);
  }

  async assignBackofficeRole(
    actor: AuthenticatedActor,
    targetUserId: string,
    assignedRole: unknown,
  ): Promise<BackofficeManagedUser> {
    if (!canAccessBackofficeCapability(actor.roles, "users")) {
      throw new ForbiddenException("administrator-role-required");
    }

    if (!isAssignableBackofficeRole(assignedRole)) {
      throw new BadRequestException("role-not-assignable");
    }

    if (
      assignedRole === "administrator" &&
      actor.telegramId !== this.config?.adminTelegramId
    ) {
      throw new ForbiddenException("main-administrator-required");
    }

    const targetUser = await this.users.findByUserId(targetUserId);
    if (!targetUser) {
      throw new NotFoundException("user-not-found");
    }

    const updatedUser = await this.users.save(
      withAssignedBackofficeRole(targetUser, assignedRole),
    );

    return toBackofficeManagedUser(updatedUser);
  }

  async ensureUserWithRoles(
    telegramId: string,
    roles: readonly Role[],
  ): Promise<User> {
    const existing = await this.users.findByTelegramId(telegramId);
    if (existing) {
      return this.users.save(withRoles(existing, roles));
    }

    return this.users.save(createUser({ telegramId, roles }));
  }
}

function toBackofficeManagedUser(user: User): BackofficeManagedUser {
  return {
    userId: user.userId,
    telegramId: user.telegramId,
    roles: user.roles,
    blocked: user.blocked,
    capabilities: visibleBackofficeCapabilities(user.roles),
  };
}
