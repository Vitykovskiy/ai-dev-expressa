import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { AccessConfig } from "../config/access-config";
import {
  BackofficeCapability,
  canAccessBackofficeCapability,
  Role,
  visibleBackofficeCapabilities
} from "../domain/role";
import { User } from "../domain/user";
import { ACCESS_CONFIG } from "../identity-access.tokens";
import { IdentityAccessService } from "../users/identity-access.service";
import { TelegramInitDataVerifier } from "./telegram-init-data.verifier";

export interface BackofficeAuthInput {
  readonly initData?: string;
  readonly testTelegramId?: string;
}

export interface AuthenticatedActor {
  readonly userId: string;
  readonly telegramId: string;
  readonly roles: readonly Role[];
  readonly capabilities: readonly BackofficeCapability[];
}

@Injectable()
export class BackofficeAuthService {
  constructor(
    @Inject(ACCESS_CONFIG)
    private readonly config: AccessConfig,
    @Inject(IdentityAccessService)
    private readonly identity: IdentityAccessService,
    @Inject(TelegramInitDataVerifier)
    private readonly telegramVerifier: TelegramInitDataVerifier
  ) {}

  async authenticate(input: BackofficeAuthInput): Promise<AuthenticatedActor> {
    const telegramId = this.resolveTelegramId(input);
    const user = await this.identity.findByTelegramId(telegramId);

    if (!user) {
      throw new ForbiddenException("backoffice-user-not-found");
    }

    if (user.blocked) {
      throw new ForbiddenException("user-blocked");
    }

    const capabilities = visibleBackofficeCapabilities(user.roles);
    if (capabilities.length === 0) {
      throw new ForbiddenException("backoffice-role-required");
    }

    return toActor(user);
  }

  async requireCapability(
    input: BackofficeAuthInput,
    capability: BackofficeCapability
  ): Promise<AuthenticatedActor> {
    const actor = await this.authenticate(input);
    if (!canAccessBackofficeCapability(actor.roles, capability)) {
      throw new ForbiddenException("backoffice-capability-forbidden");
    }

    return actor;
  }

  private resolveTelegramId(input: BackofficeAuthInput): string {
    if (this.config.disableTelegramAuth) {
      return input.testTelegramId?.trim() || this.config.adminTelegramId;
    }

    if (!input.initData) {
      throw new UnauthorizedException("telegram-init-data-required");
    }

    const token = this.config.serviceTelegramBotToken;
    if (!token) {
      throw new UnauthorizedException("telegram-bot-token-required");
    }

    return this.telegramVerifier.verify(input.initData, token).telegramId;
  }
}

function toActor(user: User): AuthenticatedActor {
  return {
    userId: user.userId,
    telegramId: user.telegramId,
    roles: user.roles,
    capabilities: visibleBackofficeCapabilities(user.roles)
  };
}
