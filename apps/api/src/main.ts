import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { DomainExceptionFilter } from "./common/http/domain-exception.filter";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.useGlobalFilters(new DomainExceptionFilter());
  await app.listen(3000);
}

void bootstrap();

