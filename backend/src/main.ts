import "reflect-metadata";
import { config as loadEnv } from "dotenv";
import { NestFactory } from "@nestjs/core";
import { join } from "node:path";

async function bootstrap(): Promise<void> {
  loadEnv({ path: join(__dirname, "..", "..", ".env") });
  const { AppModule } = await import("./app.module");
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}

void bootstrap();
