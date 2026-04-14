import { Controller, Get, UseGuards } from "@nestjs/common";

import { CurrentActor } from "../../common/auth/current-actor";
import { BackofficeAuthGuard } from "../../common/auth/backoffice-auth.guard";
import type { AuthenticatedActor } from "./auth-session.service";
import { AuthSessionService } from "./auth-session.service";

@Controller("auth/session")
@UseGuards(BackofficeAuthGuard)
export class AuthSessionController {
  constructor(private readonly authSessionService: AuthSessionService) {}

  @Get()
  getSession(@CurrentActor() actor: AuthenticatedActor) {
    return this.authSessionService.getSession(actor);
  }
}

