import {
  BackofficeCapability,
  Role,
  visibleBackofficeCapabilities
} from "./role";
import { User } from "./user";

export interface AuthenticatedActor {
  readonly userId: string;
  readonly telegramId: string;
  readonly roles: readonly Role[];
  readonly capabilities: readonly BackofficeCapability[];
}

export function toAuthenticatedActor(user: User): AuthenticatedActor {
  return {
    userId: user.userId,
    telegramId: user.telegramId,
    roles: user.roles,
    capabilities: visibleBackofficeCapabilities(user.roles)
  };
}
