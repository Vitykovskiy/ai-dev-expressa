import { HttpException, Inject, Injectable } from "@nestjs/common";
import { AccessConfig } from "../config/access-config";
import {
  AuthenticatedActor,
  BackofficeAccess,
} from "../domain/authenticated-actor";
import {
  ASSIGNABLE_ROLES,
  AssignableRole,
  hasRole,
  isAssignableRole,
  visibleBackofficeCapabilities,
} from "../domain/role";
import { withAssignedRole } from "../domain/user";
import { ACCESS_CONFIG } from "../identity-access.tokens";
import {
  USER_REPOSITORY,
  UserListFilters,
  UserRepository,
} from "./user.repository";
import {
  AdministratorRoleAssignmentForbiddenError,
  AdministratorRoleRequiredError,
  IdentityAccessReadFailedError,
  IdentityAccessWriteFailedError,
  RoleNotAssignableError,
  UserNotFoundError,
} from "./users.errors";

export interface ReadUsersQuery {
  readonly search?: string;
  readonly role?: string;
  readonly blocked?: string;
}

export interface ReadUsersResponse {
  readonly items: readonly UserListItem[];
  readonly meta: {
    readonly total: number;
  };
}

export interface UserListItem {
  readonly userId: string;
  readonly displayName: string;
  readonly telegramUsername: string;
  readonly roles: readonly string[];
  readonly blocked: boolean;
  readonly availableRoleAssignments: readonly AssignableRole[];
}

export interface AssignRoleInput {
  readonly role: string;
}

export interface AssignRoleResponse {
  readonly userId: string;
  readonly roles: readonly string[];
  readonly backofficeAccess: BackofficeAccess;
}

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
    @Inject(ACCESS_CONFIG)
    private readonly config: AccessConfig,
  ) {}

  async readUsers(
    actor: AuthenticatedActor,
    query: ReadUsersQuery,
  ): Promise<ReadUsersResponse> {
    try {
      const availableRoleAssignments =
        this.resolveAvailableRoleAssignments(actor);
      const result = await this.users.list(normalizeUserListFilters(query));

      return {
        items: result.items.map((user) => ({
          userId: user.userId,
          displayName: user.displayName,
          telegramUsername: user.telegramUsername,
          roles: user.roles,
          blocked: user.blocked,
          availableRoleAssignments,
        })),
        meta: {
          total: result.total,
        },
      };
    } catch (error) {
      throw wrapIdentityAccessReadError(error);
    }
  }

  async assignRole(
    actor: AuthenticatedActor,
    userId: string,
    input: AssignRoleInput,
  ): Promise<AssignRoleResponse> {
    if (!hasRole(actor.roles, "administrator")) {
      throw new AdministratorRoleRequiredError();
    }

    const role = parseAssignableRole(input.role);
    if (role === "administrator" && !this.isBootstrapAdministrator(actor)) {
      throw new AdministratorRoleAssignmentForbiddenError();
    }

    try {
      const user = await this.users.findByUserId(userId);
      if (!user) {
        throw new UserNotFoundError();
      }

      const savedUser = await this.users.save(withAssignedRole(user, role));

      return {
        userId: savedUser.userId,
        roles: savedUser.roles,
        backofficeAccess: {
          capabilities: visibleBackofficeCapabilities(savedUser.roles),
        },
      };
    } catch (error) {
      throw wrapIdentityAccessWriteError(error);
    }
  }

  private resolveAvailableRoleAssignments(
    actor: AuthenticatedActor,
  ): readonly AssignableRole[] {
    if (this.isBootstrapAdministrator(actor)) {
      return ASSIGNABLE_ROLES;
    }

    return ["barista"];
  }

  private isBootstrapAdministrator(actor: AuthenticatedActor): boolean {
    return (
      hasRole(actor.roles, "administrator") &&
      actor.telegramId === this.config.adminTelegramId
    );
  }
}

function normalizeUserListFilters(query: ReadUsersQuery): UserListFilters {
  return {
    search: normalizeSearchQuery(query.search),
    role: normalizeRoleFilter(query.role),
    blocked: normalizeBlockedFilter(query.blocked),
  };
}

function normalizeSearchQuery(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : undefined;
}

function normalizeRoleFilter(
  value: string | undefined,
): AssignableRole | undefined {
  if (!value) {
    return undefined;
  }

  return isAssignableRole(value) ? value : undefined;
}

function normalizeBlockedFilter(
  value: string | undefined,
): boolean | undefined {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
}

function parseAssignableRole(value: string): AssignableRole {
  if (!isAssignableRole(value)) {
    throw new RoleNotAssignableError();
  }

  return value;
}

function wrapIdentityAccessReadError(error: unknown): HttpException {
  if (error instanceof HttpException) {
    throw error;
  }

  return new IdentityAccessReadFailedError();
}

function wrapIdentityAccessWriteError(error: unknown): HttpException {
  if (error instanceof HttpException) {
    throw error;
  }

  return new IdentityAccessWriteFailedError();
}
