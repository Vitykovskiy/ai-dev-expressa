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

export class MenuCategoryHasItemsError extends BadRequestException {
  constructor() {
    super("menu-category-has-items");
  }
}

export class OptionGroupInUseError extends BadRequestException {
  constructor() {
    super("option-group-in-use");
  }
}

export class AdministratorRoleRequiredError extends ForbiddenException {
  constructor() {
    super("administrator-role-required");
  }
}
