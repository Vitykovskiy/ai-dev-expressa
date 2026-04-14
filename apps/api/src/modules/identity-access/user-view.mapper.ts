import { Injectable } from "@nestjs/common";
import type { BackofficeTab, UserRecordDto } from "@expressa/shared-types";

import type { UserRecord } from "../persistence/persistence.types";

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
export class UserViewMapper {
  toDto(user: UserRecord): UserRecordDto {
    return {
      userId: user.userId,
      telegramId: user.telegramId,
      roles: [...user.roles],
      blocked: user.blocked,
      isBootstrapAdministrator: user.isBootstrapAdministrator,
      availableTabs: getAvailableTabs(user.roles)
    };
  }
}

