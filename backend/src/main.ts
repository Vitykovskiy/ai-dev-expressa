import "reflect-metadata";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { loadRuntimeConfig } from "./config/runtime-config";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const runtimeConfig = loadRuntimeConfig({
    PORT: config.get<string>("PORT"),
    BACKOFFICE_CORS_ORIGINS: config.get<string>("BACKOFFICE_CORS_ORIGINS"),
  });

  app.enableCors({
    origin: runtimeConfig.backofficeCorsOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "content-type",
      "x-telegram-init-data",
      "x-test-telegram-id",
    ],
  });

  await app.listen(runtimeConfig.port);
}

void bootstrap();
