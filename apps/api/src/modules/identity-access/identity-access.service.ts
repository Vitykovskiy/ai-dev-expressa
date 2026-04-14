import { Inject, Injectable } from "@nestjs/common";
import type {
  AssignUserRoleRequestDto,
  BlockUserRequestDto,
  ListUsersResponseDto,
  UserMutationResponseDto
} from "@expressa/shared-types";

import { DomainError } from "../../common/errors/domain-error";
import type { AuthenticatedActor } from "../auth-session/auth-session.service";
import {
  USER_REPOSITORY,
  type UserRecord,
  type UserRepository
} from "../persistence/persistence.types";
import { AdministratorAssignmentPolicy } from "./administrator-assignment.policy";
import { UserViewMapper } from "./user-view.mapper";

const ensureTelegramId = (telegramId: string): string => {
  const normalized = telegramId.trim();

  if (!normalized) {
    throw new DomainError("invalid-auth-header", 400, "targetTelegramId is required");
  }

  return normalized;
};

@Injectable()
export class IdentityAccessService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    private readonly assignmentPolicy: AdministratorAssignmentPolicy,
    private readonly userViewMapper: UserViewMapper
  ) {}

  async listUsers(actor: AuthenticatedActor): Promise<ListUsersResponseDto> {
    this.ensureAdministrator(actor.user);
    const users = await this.userRepository.list();
    return {
      users: users.map((user) => this.userViewMapper.toDto(user))
    };
  }

  async assignRole(
    actor: AuthenticatedActor,
    request: AssignUserRoleRequestDto
  ): Promise<UserMutationResponseDto> {
    const targetTelegramId = ensureTelegramId(request.targetTelegramId);
    this.assignmentPolicy.assertCanAssignRole(actor.user, request.role);

    const existing = await this.userRepository.findByTelegramId(targetTelegramId);
    const target =
      existing ??
      (await this.userRepository.create({
        telegramId: targetTelegramId
      }));

    const nextRoles = target.roles.includes(request.role)
      ? target.roles
      : [...target.roles, request.role];
    const saved = await this.userRepository.save({
      ...target,
      roles: nextRoles
    });

    return {
      user: this.userViewMapper.toDto(saved)
    };
  }

  async blockUser(
    actor: AuthenticatedActor,
    request: BlockUserRequestDto
  ): Promise<UserMutationResponseDto> {
    this.ensureAdministrator(actor.user);
    const targetTelegramId = ensureTelegramId(request.targetTelegramId);
    const existing = await this.userRepository.findByTelegramId(targetTelegramId);

    if (!existing) {
      throw new DomainError("user-not-found", 404, "Target user does not exist");
    }

    const saved = await this.userRepository.save({
      ...existing,
      blocked: true
    });

    return {
      user: this.userViewMapper.toDto(saved)
    };
  }

  private ensureAdministrator(user: UserRecord): void {
    if (!user.roles.includes("administrator")) {
      throw new DomainError(
        "administrator-role-required",
        403,
        "Administrator role is required to access this endpoint"
      );
    }
  }
}

