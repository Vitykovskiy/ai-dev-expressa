import { describe, expect, it } from "vitest";
import {
  loadRuntimeConfig,
  RuntimeConfigValidationError,
} from "../src/config/runtime-config";

describe("loadRuntimeConfig", () => {
  it("uses the default port when PORT is omitted", () => {
    expect(
      loadRuntimeConfig({
        BACKOFFICE_CORS_ORIGINS: "http://localhost:5173",
      }),
    ).toMatchObject({
      port: 3000,
      backofficeCorsOrigins: ["http://localhost:5173"],
    });
  });

  it("rejects an invalid PORT", () => {
    expect(() =>
      loadRuntimeConfig({
        PORT: "70000",
        BACKOFFICE_CORS_ORIGINS: "http://localhost:5173",
      }),
    ).toThrow("PORT must be an integer between 1 and 65535.");
  });

  it("parses a comma-separated CORS origins list", () => {
    expect(
      loadRuntimeConfig({
        BACKOFFICE_CORS_ORIGINS: "http://localhost:5173, http://127.0.0.1:5173",
      }),
    ).toMatchObject({
      backofficeCorsOrigins: ["http://localhost:5173", "http://127.0.0.1:5173"],
    });
  });

  it("requires at least one CORS origin", () => {
    expect(() =>
      loadRuntimeConfig({
        BACKOFFICE_CORS_ORIGINS: " , ",
      }),
    ).toThrow(RuntimeConfigValidationError);
  });
});
