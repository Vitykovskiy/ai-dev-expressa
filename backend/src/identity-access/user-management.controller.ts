import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  BackofficeAuthGuard,
  BackofficeRequest,
  RequireBackofficeCapability,
} from "./auth/backoffice-auth.guard";
import { AuthenticatedActor } from "./domain/authenticated-actor";
import {
  BackofficeManagedUser,
  IdentityAccessService,
} from "./users/identity-access.service";

interface AssignUserRoleBody {
  readonly assignedRole?: unknown;
}

@Controller("backoffice/user-management/users")
@UseGuards(BackofficeAuthGuard)
@RequireBackofficeCapability("users", {
  forbiddenMessage: "administrator-role-required",
})
export class UserManagementController {
  constructor(
    @Inject(IdentityAccessService)
    private readonly identity: IdentityAccessService,
  ) {}

  @Get()
  async users(): Promise<{ readonly users: readonly BackofficeManagedUser[] }> {
    return {
      users: await this.identity.listManagedUsers(),
    };
  }

  @Patch(":userId/role")
  async assignRole(
    @Req() request: BackofficeRequest,
    @Param("userId") userId: string,
    @Body() body: AssignUserRoleBody | undefined,
  ): Promise<{ readonly user: BackofficeManagedUser }> {
    return {
      user: await this.identity.assignBackofficeRole(
        request.actor as AuthenticatedActor,
        userId,
        body?.assignedRole,
      ),
    };
  }
}
