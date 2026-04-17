import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type {
  BackofficeAccessBootstrapResponse,
  BackofficeAccessContextResponse,
} from '@expressa/shared-types';
import { BackofficeAccessService } from '../../application/services/backoffice-access.service';
import { BackofficeAccessBootstrapRequestDto } from '../dto/backoffice-access-bootstrap-request.dto';
import { AdministratorGuard } from '../guards/administrator.guard';
import { BackofficeSessionGuard } from '../guards/backoffice-session.guard';
import type { RequestWithBackofficeContext } from '../types/request-with-backoffice-context';

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
  getCurrentAccess(@Req() request: RequestWithBackofficeContext): BackofficeAccessContextResponse {
    return request.backofficeContext as BackofficeAccessContextResponse;
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
