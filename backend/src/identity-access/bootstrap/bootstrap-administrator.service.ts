import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { AccessConfig } from "../config/access-config";
import { IdentityAccessService } from "../users/identity-access.service";
import { ACCESS_CONFIG } from "../identity-access.tokens";

export const MANUAL_QA_BARISTA_TELEGRAM_ID = "777008";

@Injectable()
export class BootstrapAdministratorService implements OnApplicationBootstrap {
  constructor(
    @Inject(ACCESS_CONFIG)
    private readonly config: AccessConfig,
    @Inject(IdentityAccessService)
    private readonly identity: IdentityAccessService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.bootstrap();
  }

  async bootstrap(): Promise<void> {
    await this.identity.ensureUserWithRoles(this.config.adminTelegramId, [
      "administrator",
    ]);

    if (this.config.environment === "test" && this.config.disableTelegramAuth) {
      await this.identity.ensureUserWithRoles(MANUAL_QA_BARISTA_TELEGRAM_ID, [
        "barista",
      ]);
    }
  }
}
