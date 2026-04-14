import { Inject, Injectable } from "@nestjs/common";
import type { AssignableBackofficeRole } from "@expressa/shared-types";

import { APP_CONFIG, type AppConfig } from "../../config/app-config";
import { DomainError } from "../../common/errors/domain-error";
import type { UserRecord } from "../persistence/persistence.types";

@Injectable()
export class AdministratorAssignmentPolicy {
  constructor(@Inject(APP_CONFIG) private readonly appConfig: AppConfig) {}

  assertCanAssignRole(actor: UserRecord, role: AssignableBackofficeRole): void {
    if (!actor.roles.includes("administrator")) {
      throw new DomainError(
        "administrator-role-required",
        403,
        "Administrator role is required to manage roles"
      );
    }

    if (
      role === "administrator" &&
      this.appConfig.administratorPromotionMode === "bootstrap-only" &&
      !actor.isBootstrapAdministrator
    ) {
      throw new DomainError(
        "role-not-assignable",
        403,
        "Administrator promotion is restricted to bootstrap administrator"
      );
    }
  }
}

