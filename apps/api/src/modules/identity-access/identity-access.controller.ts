import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import type {
  AssignUserRoleRequestDto,
  BlockUserRequestDto
} from "@expressa/shared-types";

import { CurrentActor } from "../../common/auth/current-actor";
import { BackofficeAuthGuard } from "../../common/auth/backoffice-auth.guard";
import type { AuthenticatedActor } from "../auth-session/auth-session.service";
import { IdentityAccessService } from "./identity-access.service";

@Controller("users")
@UseGuards(BackofficeAuthGuard)
export class IdentityAccessController {
  constructor(private readonly identityAccessService: IdentityAccessService) {}

  @Get()
  listUsers(@CurrentActor() actor: AuthenticatedActor) {
    return this.identityAccessService.listUsers(actor);
  }

  @Post("roles")
  assignRole(
    @CurrentActor() actor: AuthenticatedActor,
    @Body() request: AssignUserRoleRequestDto
  ) {
    return this.identityAccessService.assignRole(actor, request);
  }

  @Post("block")
  blockUser(
    @CurrentActor() actor: AuthenticatedActor,
    @Body() request: BlockUserRequestDto
  ) {
    return this.identityAccessService.blockUser(actor, request);
  }
}

