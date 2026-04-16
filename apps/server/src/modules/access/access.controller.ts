import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import type { BackofficeAccessBootstrapResponse } from '@expressa/shared-types';
import { AdministratorGuard } from './administrator.guard';
import { BackofficeAccessService } from './backoffice-access.service';
import { BackofficeSessionGuard } from './backoffice-session.guard';
import { BackofficeAccessBootstrapRequestDto } from './dto/backoffice-access-bootstrap-request.dto';
import type { ResolvedBackofficeContext } from './model/backoffice-session';

type RequestWithBackofficeContext = Request & {
  backofficeContext?: ResolvedBackofficeContext;
};

@Controller('api/backoffice')
export class AccessController {
  constructor(private readonly accessService: BackofficeAccessService) {}

  @Post('access/bootstrap')
  bootstrapAccess(
    @Body() request: BackofficeAccessBootstrapRequestDto,
  ): Promise<BackofficeAccessBootstrapResponse> {
    return this.accessService.bootstrapAccess(request);
  }

  @Get('access/me')
  @UseGuards(BackofficeSessionGuard)
  getCurrentAccess(@Req() request: RequestWithBackofficeContext): ResolvedBackofficeContext {
    return request.backofficeContext as ResolvedBackofficeContext;
  }

  @Get('admin/ping')
  @UseGuards(BackofficeSessionGuard, AdministratorGuard)
  pingAdministratorScope(@Req() request: RequestWithBackofficeContext) {
    return {
      status: 'ok',
      scope: 'administrator',
      telegramId: request.backofficeContext?.user.telegramId,
    };
  }
}

