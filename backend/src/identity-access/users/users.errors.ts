import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";

export class AdministratorRoleRequiredError extends ForbiddenException {
  constructor() {
    super("administrator-role-required");
  }
}

export class AdministratorRoleAssignmentForbiddenError extends ForbiddenException {
  constructor() {
    super("administrator-role-assignment-forbidden");
  }
}

export class RoleNotAssignableError extends UnprocessableEntityException {
  constructor() {
    super("role-not-assignable");
  }
}

export class UserNotFoundError extends NotFoundException {
  constructor() {
    super("user-not-found");
  }
}

export class IdentityAccessReadFailedError extends InternalServerErrorException {
  constructor() {
    super("identity-access-read-failed");
  }
}

export class IdentityAccessWriteFailedError extends InternalServerErrorException {
  constructor() {
    super("identity-access-write-failed");
  }
}
