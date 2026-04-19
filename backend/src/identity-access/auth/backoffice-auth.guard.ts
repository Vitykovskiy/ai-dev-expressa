import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
  Optional,
  SetMetadata
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
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

export const BACKOFFICE_CAPABILITY_METADATA = "backofficeCapability";

export const RequireBackofficeCapability = (capability: BackofficeCapability) =>
  SetMetadata(BACKOFFICE_CAPABILITY_METADATA, capability);

@Injectable()
export class BackofficeAuthGuard implements CanActivate {
  constructor(
    @Inject(BackofficeAuthService)
    private readonly auth: BackofficeAuthService,
    @Optional()
    private readonly reflector?: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<BackofficeRequest>();
    const capability = this.resolveCapability(context, request);

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

  private resolveCapability(
    context: ExecutionContext,
    request: BackofficeRequest
  ): string | undefined {
    return (
      this.reflector?.getAllAndOverride<BackofficeCapability>(
        BACKOFFICE_CAPABILITY_METADATA,
        [context.getHandler(), context.getClass()]
      ) ?? request.params.capability
    );
  }
}

function getHeader(request: Request, name: string): string | undefined {
  const value = request.headers[name];
  return Array.isArray(value) ? value[0] : value;
}

function isBackofficeCapability(value: string | undefined): value is BackofficeCapability {
  return BACKOFFICE_CAPABILITIES.includes(value as BackofficeCapability);
}
