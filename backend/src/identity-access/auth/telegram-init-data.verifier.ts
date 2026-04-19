import { createHmac, timingSafeEqual } from "node:crypto";
import { Injectable, UnauthorizedException } from "@nestjs/common";

export interface TelegramActor {
  readonly telegramId: string;
}

@Injectable()
export class TelegramInitDataVerifier {
  verify(initData: string, botToken: string): TelegramActor {
    const params = new URLSearchParams(initData);
    const receivedHash = params.get("hash");

    if (!receivedHash) {
      throw new UnauthorizedException("telegram-hash-required");
    }

    params.delete("hash");
    const dataCheckString = [...params.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    const secret = createHmac("sha256", "WebAppData").update(botToken).digest();
    const expectedHash = createHmac("sha256", secret).update(dataCheckString).digest("hex");

    if (!safeEqualHex(receivedHash, expectedHash)) {
      throw new UnauthorizedException("telegram-hash-invalid");
    }

    const userPayload = params.get("user");
    if (!userPayload) {
      throw new UnauthorizedException("telegram-user-required");
    }

    const user = parseTelegramUser(userPayload);
    if (!user.id) {
      throw new UnauthorizedException("telegram-user-id-required");
    }

    return { telegramId: String(user.id) };
  }
}

function safeEqualHex(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function parseTelegramUser(value: string): { id?: number | string } {
  try {
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed === "object" && parsed !== null && "id" in parsed) {
      return parsed as { id?: number | string };
    }
  } catch {
    throw new UnauthorizedException("telegram-user-invalid");
  }

  throw new UnauthorizedException("telegram-user-invalid");
}
