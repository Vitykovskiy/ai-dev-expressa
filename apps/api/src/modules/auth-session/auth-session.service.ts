import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { AccessChannel, SystemRole } from "@expressa/shared-types";

import { APP_CONFIG, type AppConfig } from "../../config/app-config";
import { DomainError } from "../../common/errors/domain-error";
import {
  USER_REPOSITORY,
  type UserRecord,
  type UserRepository
} from "../persistence/persistence.types";
import { SessionViewMapper } from "./session-view.mapper";

export interface AuthenticatedActor {
  user: UserRecord;
  accessChannel: AccessChannel;
  testMode: boolean;
}

const getFirstHeaderValue = (value: string | string[] | undefined): string | null => {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && value.length > 0) {
    return value[0] ?? null;
  }

  return null;
};

@Injectable()
export class AuthSessionService implements OnModuleInit {
  constructor(
    @Inject(APP_CONFIG) private readonly appConfig: AppConfig,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    private readonly sessionViewMapper: SessionViewMapper
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ensureBootstrapAdministrator();
  }

  async resolveActor(
    headers: Record<string, string | string[] | undefined>
  ): Promise<AuthenticatedActor> {
    await this.ensureBootstrapAdministrator();

    const actor = this.appConfig.disableTelegramAuth
      ? await this.resolveTestModeActor(headers)
      : await this.resolveTelegramActor(headers);

    if (actor.user.blocked) {
      throw new DomainError("user-blocked", 403, "Blocked users cannot access backoffice");
    }

    if (!actor.user.roles.includes("administrator")) {
      throw new DomainError(
        "administrator-role-required",
        403,
        "Administrator role is required for DU-01 backoffice"
      );
    }

    return actor;
  }

  getSession(actor: AuthenticatedActor) {
    return this.sessionViewMapper.toDto(actor);
  }

  async ensureBootstrapAdministrator(): Promise<UserRecord> {
    const existing = await this.userRepository.findByTelegramId(this.appConfig.adminTelegramId);

    if (!existing) {
      return this.userRepository.create({
        telegramId: this.appConfig.adminTelegramId,
        roles: ["administrator"],
        isBootstrapAdministrator: true
      });
    }

    const nextRoles: SystemRole[] = existing.roles.includes("administrator")
      ? existing.roles
      : [...existing.roles, "administrator"];
    const needsUpdate =
      !existing.isBootstrapAdministrator || nextRoles.length !== existing.roles.length;

    if (!needsUpdate) {
      return existing;
    }

    return this.userRepository.save({
      ...existing,
      roles: nextRoles,
      isBootstrapAdministrator: true
    });
  }

  private async resolveTestModeActor(
    headers: Record<string, string | string[] | undefined>
  ): Promise<AuthenticatedActor> {
    const telegramId = getFirstHeaderValue(headers["x-test-telegram-id"])?.trim();

    if (!telegramId) {
      throw new DomainError(
        "invalid-auth-header",
        401,
        "x-test-telegram-id header is required in test mode"
      );
    }

    return {
      user: await this.ensureUserExists(telegramId),
      accessChannel: "test-mode-without-telegram",
      testMode: true
    };
  }

  private async resolveTelegramActor(
    headers: Record<string, string | string[] | undefined>
  ): Promise<AuthenticatedActor> {
    const authorization = getFirstHeaderValue(headers.authorization);
    const fallbackInitData = getFirstHeaderValue(headers["x-telegram-init-data"]);
    const initData = authorization?.startsWith("tma ") ? authorization.slice(4) : fallbackInitData;

    if (!initData) {
      throw new DomainError(
        "invalid-auth-header",
        401,
        "Telegram init data is required outside of test mode"
      );
    }

    if (!this.appConfig.backofficeBotToken) {
      throw new DomainError(
        "telegram-auth-disabled",
        500,
        "TG_BACKOFFICE_BOT_TOKEN is required for Telegram auth"
      );
    }

    const params = new URLSearchParams(initData);
    const providedHash = params.get("hash");
    const userPayload = params.get("user");

    if (!providedHash || !userPayload) {
      throw new DomainError("telegram-auth-failed", 401, "Telegram init data is malformed");
    }

    const signaturePayload = [...params.entries()]
      .filter(([key]) => key !== "hash")
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    const secret = createHmac("sha256", "WebAppData")
      .update(this.appConfig.backofficeBotToken)
      .digest();
    const calculatedHash = createHmac("sha256", secret).update(signaturePayload).digest("hex");

    if (!this.hashMatches(providedHash, calculatedHash)) {
      throw new DomainError("telegram-auth-failed", 401, "Telegram init data signature is invalid");
    }

    let telegramId: string;
    try {
      const parsed = JSON.parse(userPayload) as { id?: number | string };
      telegramId = String(parsed.id ?? "");
    } catch {
      throw new DomainError("telegram-auth-failed", 401, "Telegram user payload is invalid");
    }

    if (!telegramId) {
      throw new DomainError("telegram-auth-failed", 401, "Telegram user payload is invalid");
    }

    return {
      user: await this.ensureUserExists(telegramId),
      accessChannel: "backoffice-telegram-entry",
      testMode: false
    };
  }

  private async ensureUserExists(telegramId: string): Promise<UserRecord> {
    const existing = await this.userRepository.findByTelegramId(telegramId);

    if (existing) {
      return existing;
    }

    return this.userRepository.create({
      telegramId,
      roles: telegramId === this.appConfig.adminTelegramId ? ["administrator"] : [],
      isBootstrapAdministrator: telegramId === this.appConfig.adminTelegramId
    });
  }

  private hashMatches(left: string, right: string): boolean {
    const leftBuffer = Buffer.from(left, "hex");
    const rightBuffer = Buffer.from(right, "hex");

    if (leftBuffer.length !== rightBuffer.length) {
      return false;
    }

    return timingSafeEqual(leftBuffer, rightBuffer);
  }
}
