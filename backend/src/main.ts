import "reflect-metadata";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

async function bootstrap(): Promise<void> {
  const { AppModule } = await import("./app.module");
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = Number(config.get<string>("PORT") ?? 3000);
  await app.listen(port);
}

void bootstrap();
