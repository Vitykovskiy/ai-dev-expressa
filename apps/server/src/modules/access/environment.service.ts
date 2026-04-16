import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EnvironmentService {
  readonly adminTelegramId: string;
  readonly disableTelegramAuth: boolean;
  readonly backofficeBotToken: string | null;

  constructor(private readonly configService: ConfigService) {
    this.adminTelegramId = this.readRequiredDigits("ADMIN_TELEGRAM_ID");
    this.disableTelegramAuth = this.readBoolean("DISABLE_TG_AUTH");
    this.backofficeBotToken = this.readOptionalString("TG_BACKOFFICE_BOT_TOKEN");

    if (!this.disableTelegramAuth && !this.backofficeBotToken) {
      throw new Error(
        "TG_BACKOFFICE_BOT_TOKEN is required when DISABLE_TG_AUTH is false",
      );
    }
  }

  private readRequiredDigits(name: string): string {
    const value = this.configService.get<string>(name)?.trim();

    if (!value || !/^\d+$/.test(value)) {
      throw new Error(`${name} must be a non-empty digit string`);
    }

    return value;
  }

  private readOptionalString(name: string): string | null {
    const value = this.configService.get<string>(name)?.trim();
    return value ? value : null;
  }

  private readBoolean(name: string): boolean {
    return this.configService.get<string>(name)?.trim().toLowerCase() === "true";
  }
}
