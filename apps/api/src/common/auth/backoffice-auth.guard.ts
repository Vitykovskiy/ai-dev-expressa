import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { AuthSessionService } from "../../modules/auth-session/auth-session.service";

@Injectable()
export class BackofficeAuthGuard implements CanActivate {
  constructor(private readonly authSessionService: AuthSessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
      currentActor?: Awaited<ReturnType<AuthSessionService["resolveActor"]>>;
    }>();

    request.currentActor = await this.authSessionService.resolveActor(request.headers);
    return true;
  }
}

