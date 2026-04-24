import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Param,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  BackofficeAuthGuard,
  BackofficeRequest,
  RequireBackofficeCapability,
} from "../auth/backoffice-auth.guard";
import {
  AssignRoleInput,
  AssignRoleResponse,
  ReadUsersQuery,
  ReadUsersResponse,
  UsersService,
} from "./users.service";

@Controller("backoffice/users")
@UseGuards(BackofficeAuthGuard)
@RequireBackofficeCapability("users")
export class UsersController {
  constructor(
    @Inject(UsersService)
    private readonly users: UsersService,
  ) {}

  @Get()
  async readUsers(
    @Req() request: BackofficeRequest,
    @Query() query: ReadUsersQuery,
  ): Promise<ReadUsersResponse> {
    return this.users.readUsers(assertActor(request), query);
  }

  @Patch(":userId/role")
  async assignRole(
    @Req() request: BackofficeRequest,
    @Param("userId") userId: string,
    @Body() body: AssignRoleInput,
  ): Promise<AssignRoleResponse> {
    return this.users.assignRole(assertActor(request), userId, body);
  }
}

function assertActor(request: BackofficeRequest) {
  if (!request.actor) {
    throw new Error("Backoffice actor is required after auth guard.");
  }

  return request.actor;
}
