import { Injectable } from "@nestjs/common";
import { SystemRole as PrismaSystemRole } from "@prisma/client";
import type { SystemRole } from "@expressa/shared-types";

import type { NewUserRecord, UserRecord, UserRepository } from "../persistence.types";
import { PrismaService } from "./prisma.service";

const fromPrismaRole = (role: PrismaSystemRole): SystemRole => {
  switch (role) {
    case PrismaSystemRole.CUSTOMER:
      return "customer";
    case PrismaSystemRole.BARISTA:
      return "barista";
    case PrismaSystemRole.ADMINISTRATOR:
      return "administrator";
  }
};

const toPrismaRole = (role: SystemRole): PrismaSystemRole => {
  switch (role) {
    case "customer":
      return PrismaSystemRole.CUSTOMER;
    case "barista":
      return PrismaSystemRole.BARISTA;
    case "administrator":
      return PrismaSystemRole.ADMINISTRATOR;
  }
};

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByTelegramId(telegramId: string): Promise<UserRecord | null> {
    const user = await this.prismaService.user.findUnique({
      where: { telegramId }
    });

    return user ? this.toDomain(user) : null;
  }

  async create(input: NewUserRecord): Promise<UserRecord> {
    const user = await this.prismaService.user.create({
      data: {
        telegramId: input.telegramId,
        roles: (input.roles ?? []).map(toPrismaRole),
        blocked: input.blocked ?? false,
        isBootstrapAdministrator: input.isBootstrapAdministrator ?? false
      }
    });

    return this.toDomain(user);
  }

  async save(user: UserRecord): Promise<UserRecord> {
    const saved = await this.prismaService.user.update({
      where: { telegramId: user.telegramId },
      data: {
        roles: user.roles.map(toPrismaRole),
        blocked: user.blocked,
        isBootstrapAdministrator: user.isBootstrapAdministrator
      }
    });

    return this.toDomain(saved);
  }

  async list(): Promise<UserRecord[]> {
    const users = await this.prismaService.user.findMany({
      orderBy: { telegramId: "asc" }
    });

    return users.map((user) => this.toDomain(user));
  }

  private toDomain(user: {
    id: string;
    telegramId: string;
    roles: PrismaSystemRole[];
    blocked: boolean;
    isBootstrapAdministrator: boolean;
  }): UserRecord {
    return {
      userId: user.id,
      telegramId: user.telegramId,
      roles: user.roles.map(fromPrismaRole),
      blocked: user.blocked,
      isBootstrapAdministrator: user.isBootstrapAdministrator
    };
  }
}

