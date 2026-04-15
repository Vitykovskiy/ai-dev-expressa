import { Injectable } from '@nestjs/common';
import {
  IdentityRole,
  type User,
} from '@prisma/client';
import type { UserRole } from '@expressa/shared-types' with {
  "resolution-mode": "import"
};

import { PrismaService } from '../../shared/persistence/prisma.service';
import type {
  IdentityAccessRepository,
  IdentityUserRecord,
  UpsertIdentityUserInput,
} from './identity-access.types';

function toSharedUserRole(role: IdentityRole): UserRole {
  switch (role) {
    case IdentityRole.customer:
      return 'customer';
    case IdentityRole.barista:
      return 'barista';
    case IdentityRole.administrator:
      return 'administrator';
  }

  throw new Error(`Unsupported identity role: ${String(role)}`);
}

function toIdentityUserRecord(user: User): IdentityUserRecord {
  return {
    blocked: user.blocked,
    displayName: user.displayName,
    roles: user.roles.map(toSharedUserRole),
    telegramId: user.telegramId,
    userId: user.id,
  };
}

function hasSameRoles(
  left: IdentityRole[],
  right: IdentityRole[],
): boolean {
  return left.length === right.length
    && left.every((role, index) => role === right[index]);
}

function withAdministratorRole(roles: IdentityRole[]): IdentityRole[] {
  if (roles.includes(IdentityRole.administrator)) {
    return roles;
  }

  return [...roles, IdentityRole.administrator];
}

@Injectable()
export class PrismaIdentityAccessRepository implements IdentityAccessRepository {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async upsertTelegramUser(
    input: UpsertIdentityUserInput,
  ): Promise<IdentityUserRecord> {
    return this.prismaService.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: {
          telegramId: input.telegramId,
        },
      });

      if (existingUser === null) {
        return toIdentityUserRecord(
          await tx.user.create({
            data: {
              displayName: input.displayName,
              roles: input.ensureAdministrator ? [IdentityRole.administrator] : [],
              telegramId: input.telegramId,
            },
          }),
        );
      }

      const nextRoles = input.ensureAdministrator
        ? withAdministratorRole(existingUser.roles)
        : existingUser.roles;
      const shouldUpdate =
        existingUser.displayName !== input.displayName
        || !hasSameRoles(existingUser.roles, nextRoles);

      if (!shouldUpdate) {
        return toIdentityUserRecord(existingUser);
      }

      return toIdentityUserRecord(
        await tx.user.update({
          data: {
            displayName: input.displayName,
            roles: {
              set: nextRoles,
            },
          },
          where: {
            id: existingUser.id,
          },
        }),
      );
    });
  }
}
