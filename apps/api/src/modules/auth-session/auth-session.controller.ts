import type {
  AuthSessionBootstrapRequest,
  AuthSessionBootstrapResponse,
} from '@expressa/shared-types' with {
  "resolution-mode": "import"
};
import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { AuthSessionService } from './auth-session.service';

function isAuthSessionBootstrapRequest(
  payload: unknown,
): payload is AuthSessionBootstrapRequest {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }

  const candidate = payload as {
    initData?: unknown;
    mode?: unknown;
  };

  if (candidate.mode === 'test-mode') {
    return true;
  }

  return candidate.mode === 'telegram-webapp'
    && typeof candidate.initData === 'string'
    && candidate.initData.length > 0;
}

function toDeniedStatusCode(
  response: Exclude<AuthSessionBootstrapResponse, { kind: 'authenticated' }>,
): number {
  if (response.kind === 'blocked') {
    return HttpStatus.FORBIDDEN;
  }

  switch (response.code) {
    case 'administrator-role-required':
      return HttpStatus.FORBIDDEN;
    case 'telegram-entry-required':
      return HttpStatus.UNAUTHORIZED;
    case 'test-mode-disabled':
      return HttpStatus.FORBIDDEN;
  }
}

@Controller('api/auth')
export class AuthSessionController {
  constructor(
    private readonly authSessionService: AuthSessionService,
  ) {}

  @Post('session')
  @HttpCode(HttpStatus.OK)
  async bootstrapSession(
    @Body() payload: unknown,
  ): Promise<AuthSessionBootstrapResponse> {
    if (!isAuthSessionBootstrapRequest(payload)) {
      throw new BadRequestException('Auth session request has invalid shape');
    }

    const response = await this.authSessionService.bootstrapSession(payload);

    if (response.kind === 'authenticated') {
      return response;
    }

    throw new HttpException(response, toDeniedStatusCode(response));
  }
}
