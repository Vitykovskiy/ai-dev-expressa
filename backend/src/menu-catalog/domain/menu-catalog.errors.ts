import { BadRequestException, ForbiddenException } from "@nestjs/common";

export class InvalidDrinkSizeModelError extends BadRequestException {
  constructor() {
    super("invalid-drink-size-model");
  }
}

export class InvalidOptionGroupRuleError extends BadRequestException {
  constructor() {
    super("invalid-option-group-rule");
  }
}

export class AdministratorRoleRequiredError extends ForbiddenException {
  constructor() {
    super("administrator-role-required");
  }
}
