import { Module } from "@nestjs/common";

import { AuthSessionModule } from "../auth-session/auth-session.module";
import { AdministratorAssignmentPolicy } from "./administrator-assignment.policy";
import { IdentityAccessController } from "./identity-access.controller";
import { IdentityAccessService } from "./identity-access.service";
import { UserViewMapper } from "./user-view.mapper";

@Module({
  imports: [AuthSessionModule],
  controllers: [IdentityAccessController],
  providers: [AdministratorAssignmentPolicy, IdentityAccessService, UserViewMapper],
  exports: [IdentityAccessService, UserViewMapper, AdministratorAssignmentPolicy]
})
export class IdentityAccessModule {}
