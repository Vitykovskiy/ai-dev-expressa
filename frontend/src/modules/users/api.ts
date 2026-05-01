import { getTelegramInitData } from "@/modules/auth/telegram";
import {
  isErrorResponseBody,
  readJson,
  resolveApiUrl,
} from "@/modules/shared/http";
import { isRecord } from "@/modules/shared/type-guards";
import type { BackofficeCapability, Role } from "@/modules/auth/types";
import type {
  AssignUserRolePayload,
  UserManagementErrorCode,
  UserManagementUser,
} from "@/modules/users/types";

export interface UserManagementApiOptions {
  readonly apiBaseUrl?: string;
  readonly testTelegramId?: string;
  readonly initData?: string;
  readonly fetchImpl?: typeof fetch;
}

export interface UserManagementClient {
  getUsers(): Promise<readonly UserManagementUser[]>;
  assignRole(
    userId: string,
    payload: AssignUserRolePayload,
  ): Promise<UserManagementUser>;
}

export class UserManagementApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: UserManagementErrorCode,
  ) {
    super(message);
    this.name = "UserManagementApiError";
  }
}

export class UserManagementApi implements UserManagementClient {
  constructor(private readonly options: UserManagementApiOptions = {}) {}

  async getUsers(): Promise<readonly UserManagementUser[]> {
    const body = await this.request<unknown>(
      "/backoffice/user-management/users",
    );
    if (!isUsersListResponse(body)) {
      throw new UserManagementApiError(
        "user-management-request-failed",
        200,
        "user-management-request-failed",
      );
    }

    return body.users;
  }

  async assignRole(
    userId: string,
    payload: AssignUserRolePayload,
  ): Promise<UserManagementUser> {
    const body = await this.request<unknown>(
      `/backoffice/user-management/users/${encodePathId(userId)}/role`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );
    if (!isAssignUserRoleResponse(body)) {
      throw new UserManagementApiError(
        "user-management-request-failed",
        200,
        "user-management-request-failed",
      );
    }

    return body.user;
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await (this.options.fetchImpl ?? fetch)(
      this.resolveUrl(path),
      {
        ...init,
        headers: {
          "content-type": "application/json",
          ...this.authHeaders(),
          ...init.headers,
        },
      },
    );

    const body = await readJson(response);
    if (!response.ok) {
      const code = readErrorCode(body);
      throw new UserManagementApiError(code, response.status, code);
    }

    return body as T;
  }

  private resolveUrl(path: string): string {
    return resolveApiUrl(this.options.apiBaseUrl, path);
  }

  private authHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    const initData = this.options.initData ?? getTelegramInitData();
    if (initData) {
      headers["x-telegram-init-data"] = initData;
    }

    const testTelegramId = this.options.testTelegramId?.trim();
    if (testTelegramId) {
      headers["x-test-telegram-id"] = testTelegramId;
    }

    return headers;
  }
}

export function createUserManagementApi(): UserManagementApi {
  return new UserManagementApi({
    apiBaseUrl: import.meta.env.VITE_BACKOFFICE_API_BASE_URL,
    testTelegramId: import.meta.env.VITE_BACKOFFICE_TEST_TELEGRAM_ID,
  });
}

function readErrorCode(body: unknown): UserManagementErrorCode {
  if (isErrorResponseBody(body) && typeof body.message === "string") {
    return body.message as UserManagementErrorCode;
  }

  return "user-management-request-failed";
}

function encodePathId(id: string): string {
  return encodeURIComponent(id);
}

function isUsersListResponse(
  value: unknown,
): value is { readonly users: readonly UserManagementUser[] } {
  return (
    isRecord(value) &&
    Array.isArray(value.users) &&
    value.users.every(isUserManagementUser)
  );
}

function isAssignUserRoleResponse(
  value: unknown,
): value is { readonly user: UserManagementUser } {
  return isRecord(value) && isUserManagementUser(value.user);
}

function isUserManagementUser(value: unknown): value is UserManagementUser {
  if (!isRecord(value)) {
    return false;
  }

  const candidate = value as Partial<Record<keyof UserManagementUser, unknown>>;
  return (
    typeof candidate.userId === "string" &&
    typeof candidate.telegramId === "string" &&
    Array.isArray(candidate.roles) &&
    candidate.roles.every(isRole) &&
    typeof candidate.blocked === "boolean" &&
    isOptionalString(candidate.displayLabel) &&
    isOptionalCapabilityList(candidate.capabilities)
  );
}

function isRole(value: unknown): value is Role {
  return (
    value === "customer" || value === "barista" || value === "administrator"
  );
}

function isOptionalString(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || typeof value === "string";
}

function isOptionalCapabilityList(
  value: unknown,
): value is readonly BackofficeCapability[] | undefined {
  return (
    value === undefined ||
    (Array.isArray(value) && value.every((item) => typeof item === "string"))
  );
}
