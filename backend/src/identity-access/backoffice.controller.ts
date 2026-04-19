import { Body, Controller, Get, Inject, Post, Req, UseGuards } from "@nestjs/common";
import { BackofficeAuthGuard, BackofficeRequest } from "./auth/backoffice-auth.guard";
import {
  AuthenticatedActor,
  BackofficeAuthService
} from "./auth/backoffice-auth.service";

interface SessionRequestBody {
  readonly initData?: string;
  readonly testTelegramId?: string;
}

@Controller("backoffice")
export class BackofficeController {
  constructor(
    @Inject(BackofficeAuthService)
    private readonly auth: BackofficeAuthService
  ) {}

  @Post("auth/session")
  async session(@Body() body: SessionRequestBody): Promise<AuthenticatedActor> {
    return this.auth.authenticate({
      initData: body.initData,
      testTelegramId: body.testTelegramId
    });
  }

  @Get(":capability")
  @UseGuards(BackofficeAuthGuard)
  async capability(@Req() request: BackofficeRequest): Promise<AuthenticatedActor> {
    return request.actor as AuthenticatedActor;
  }
}
