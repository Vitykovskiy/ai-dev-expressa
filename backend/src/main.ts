import "reflect-metadata";
import { existsSync } from "node:fs";
import type { NextFunction, Request, Response } from "express";
import { config as loadEnv } from "dotenv";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "node:path";

async function bootstrap(): Promise<void> {
  loadEnv({ path: join(__dirname, "..", "..", ".env") });
  const { AppModule } = await import("./app.module");
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const frontendDistPath = join(__dirname, "..", "..", "frontend", "dist");
  const frontendIndexPath = join(frontendDistPath, "index.html");

  if (existsSync(frontendIndexPath)) {
    app.useStaticAssets(frontendDistPath);
    app.use((request: Request, response: Response, next: NextFunction) => {
      if (
        request.method !== "GET" ||
        request.path === "/health" ||
        request.path.startsWith("/backoffice")
      ) {
        next();
        return;
      }

      response.sendFile(frontendIndexPath);
    });
  }

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}

void bootstrap();
