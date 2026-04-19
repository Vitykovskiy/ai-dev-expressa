import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  BackofficeAuthGuard,
  BackofficeRequest,
} from "./auth/backoffice-auth.guard";
import { BackofficeAuthInput } from "./auth/backoffice-auth.input";
import { BackofficeAuthService } from "./auth/backoffice-auth.service";
import { AuthenticatedActor } from "./domain/authenticated-actor";

@Controller("backoffice")
export class BackofficeController {
  constructor(
    @Inject(BackofficeAuthService)
    private readonly auth: BackofficeAuthService,
  ) {}

  @Post("auth/session")
  async session(
    @Body() body: BackofficeAuthInput,
  ): Promise<AuthenticatedActor> {
    return this.auth.authenticate({
      initData: body.initData,
      testTelegramId: body.testTelegramId,
    });
  }

  @Get(":capability")
  @UseGuards(BackofficeAuthGuard)
  async capability(
    @Req() request: BackofficeRequest,
  ): Promise<AuthenticatedActor> {
    return request.actor as AuthenticatedActor;
  }
}
