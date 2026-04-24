import { getTelegramInitData } from "@/modules/auth/telegram";
import {
  isErrorResponseBody,
  readJson,
  resolveApiUrl,
} from "@/modules/shared/http";
import { isRecord } from "@/modules/shared/type-guards";
import type {
  AssignUserRolePayload,
  AssignUserRoleResult,
  ReadUsersParams,
  UserManagementErrorCode,
  UsersListSnapshot,
  UserSummary,
} from "@/modules/user-management/types";

export interface UserManagementApiOptions {
  readonly apiBaseUrl?: string;
  readonly testTelegramId?: string;
  readonly initData?: string;
  readonly fetchImpl?: typeof fetch;
}

export interface UserManagementClient {
  getUsers(params?: ReadUsersParams): Promise<UsersListSnapshot>;
  assignRole(
    userId: string,
    payload: AssignUserRolePayload,
  ): Promise<AssignUserRoleResult>;
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

  async getUsers(params: ReadUsersParams = {}): Promise<UsersListSnapshot> {
    const query = new URLSearchParams();
    const search = params.search?.trim();
    if (search) {
      query.set("search", search);
    }

    if (params.filter === "barista") {
      query.set("role", "barista");
    }

    if (params.filter === "blocked") {
      query.set("blocked", "true");
    }

    const suffix = query.size > 0 ? `?${query.toString()}` : "";
    return this.request<UsersListSnapshot>(`/backoffice/users${suffix}`);
  }

  async assignRole(
    userId: string,
    payload: AssignUserRolePayload,
  ): Promise<AssignUserRoleResult> {
    return this.request<AssignUserRoleResult>(
      `/backoffice/users/${encodeURIComponent(userId)}/role`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );
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

    if (path.includes("/role")) {
      if (!isAssignUserRoleResult(body)) {
        throw new UserManagementApiError(
          "user-management-request-failed",
          response.status,
          "user-management-request-failed",
        );
      }

      return body as T;
    }

    if (!isUsersListSnapshot(body)) {
      throw new UserManagementApiError(
        "user-management-request-failed",
        response.status,
        "user-management-request-failed",
      );
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

function isUsersListSnapshot(value: unknown): value is UsersListSnapshot {
  if (!isRecord(value)) {
    return false;
  }

  const items = value.items;
  const meta = value.meta;
  return (
    Array.isArray(items) &&
    items.every((item) => isUserSummary(item)) &&
    isRecord(meta) &&
    typeof meta.total === "number"
  );
}

function isUserSummary(value: unknown): value is UserSummary {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.userId === "string" &&
    typeof value.displayName === "string" &&
    typeof value.telegramUsername === "string" &&
    Array.isArray(value.roles) &&
    value.roles.every((role) => typeof role === "string") &&
    typeof value.blocked === "boolean" &&
    Array.isArray(value.availableRoleAssignments) &&
    value.availableRoleAssignments.every((role) => typeof role === "string")
  );
}

function isAssignUserRoleResult(value: unknown): value is AssignUserRoleResult {
  if (!isRecord(value) || !isRecord(value.backofficeAccess)) {
    return false;
  }

  return (
    typeof value.userId === "string" &&
    Array.isArray(value.roles) &&
    value.roles.every((role) => typeof role === "string") &&
    Array.isArray(value.backofficeAccess.capabilities) &&
    value.backofficeAccess.capabilities.every(
      (capability) => typeof capability === "string",
    )
  );
}
