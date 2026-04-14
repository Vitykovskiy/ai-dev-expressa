import { Module } from "@nestjs/common";

import { BackofficeAuthGuard } from "../../common/auth/backoffice-auth.guard";
import { AuthSessionController } from "./auth-session.controller";
import { AuthSessionService } from "./auth-session.service";
import { SessionViewMapper } from "./session-view.mapper";

@Module({
  controllers: [AuthSessionController],
  providers: [AuthSessionService, SessionViewMapper, BackofficeAuthGuard],
  exports: [AuthSessionService, SessionViewMapper, BackofficeAuthGuard]
})
export class AuthSessionModule {}
