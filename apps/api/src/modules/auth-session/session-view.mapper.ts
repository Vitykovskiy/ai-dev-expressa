import { Injectable } from "@nestjs/common";
import type { AuthSessionDto, BackofficeTab } from "@expressa/shared-types";

import type { AuthenticatedActor } from "./auth-session.service";

const getAvailableTabs = (roles: string[]): BackofficeTab[] => {
  if (roles.includes("administrator")) {
    return ["orders", "availability", "menu", "users", "settings"];
  }

  if (roles.includes("barista")) {
    return ["orders", "availability"];
  }

  return [];
};

@Injectable()
export class SessionViewMapper {
  toDto(actor: AuthenticatedActor): AuthSessionDto {
    return {
      user: {
        userId: actor.user.userId,
        telegramId: actor.user.telegramId,
        roles: [...actor.user.roles],
        blocked: actor.user.blocked,
        isBootstrapAdministrator: actor.user.isBootstrapAdministrator,
        availableTabs: getAvailableTabs(actor.user.roles)
      },
      accessChannel: actor.accessChannel,
      testMode: actor.testMode
    };
  }
}

