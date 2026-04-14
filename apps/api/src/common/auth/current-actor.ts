import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import type { AuthenticatedActor } from "../../modules/auth-session/auth-session.service";

export const CurrentActor = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedActor => {
    const request = context.switchToHttp().getRequest<{ currentActor: AuthenticatedActor }>();
    return request.currentActor;
  }
);

