import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AccessConfig } from "../config/access-config";
import {
  BackofficeCapability,
  canAccessBackofficeCapability,
  visibleBackofficeCapabilities,
} from "../domain/role";
import {
  AuthenticatedActor,
  toAuthenticatedActor,
} from "../domain/authenticated-actor";
import { ACCESS_CONFIG } from "../identity-access.tokens";
import { IdentityAccessService } from "../users/identity-access.service";
import { BackofficeAuthInput } from "./backoffice-auth.input";
import { TelegramInitDataVerifier } from "./telegram-init-data.verifier";

@Injectable()
export class BackofficeAuthService {
  constructor(
    @Inject(ACCESS_CONFIG)
    private readonly config: AccessConfig,
    @Inject(IdentityAccessService)
    private readonly identity: IdentityAccessService,
    @Inject(TelegramInitDataVerifier)
    private readonly telegramVerifier: TelegramInitDataVerifier,
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

    return toAuthenticatedActor(user);
  }

  async requireCapability(
    input: BackofficeAuthInput,
    capability: BackofficeCapability,
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
