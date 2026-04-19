import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { Request } from "express";
import {
  BACKOFFICE_CAPABILITIES,
  BackofficeCapability
} from "../domain/role";
import {
  AuthenticatedActor,
  BackofficeAuthService
} from "./backoffice-auth.service";

export interface BackofficeRequest extends Request {
  actor?: AuthenticatedActor;
}

@Injectable()
export class BackofficeAuthGuard implements CanActivate {
  constructor(
    @Inject(BackofficeAuthService)
    private readonly auth: BackofficeAuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<BackofficeRequest>();
    const capability = request.params.capability;

    if (!isBackofficeCapability(capability)) {
      throw new NotFoundException("backoffice-capability-not-found");
    }

    request.actor = await this.auth.requireCapability(
      {
        initData: getHeader(request, "x-telegram-init-data"),
        testTelegramId: getHeader(request, "x-test-telegram-id")
      },
      capability
    );

    return true;
  }
}

function getHeader(request: Request, name: string): string | undefined {
  const value = request.headers[name];
  return Array.isArray(value) ? value[0] : value;
}

function isBackofficeCapability(value: string): value is BackofficeCapability {
  return BACKOFFICE_CAPABILITIES.includes(value as BackofficeCapability);
}
