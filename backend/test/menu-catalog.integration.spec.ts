import "reflect-metadata";
import { INestApplication } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { BackofficeAuthGuard } from "../src/identity-access/auth/backoffice-auth.guard";
import { BackofficeAuthService } from "../src/identity-access/auth/backoffice-auth.service";
import { TelegramInitDataVerifier } from "../src/identity-access/auth/telegram-init-data.verifier";
import { BootstrapAdministratorService } from "../src/identity-access/bootstrap/bootstrap-administrator.service";
import { AccessConfig } from "../src/identity-access/config/access-config";
import { BackofficeController } from "../src/identity-access/backoffice.controller";
import { provideAccessConfig } from "../src/identity-access/identity-access.tokens";
import { InMemoryUserRepository } from "../src/identity-access/users/in-memory-user.repository";
import { IdentityAccessService } from "../src/identity-access/users/identity-access.service";
import { USER_REPOSITORY } from "../src/identity-access/users/user.repository";
import { MenuCatalogValidator } from "../src/menu-catalog/domain/menu-catalog.validator";
import { MenuCatalogController } from "../src/menu-catalog/menu-catalog.controller";
import { MenuCatalogService } from "../src/menu-catalog/menu-catalog.service";
import { InMemoryMenuCatalogRepository } from "../src/menu-catalog/repository/in-memory-menu-catalog.repository";
import { MENU_CATALOG_REPOSITORY } from "../src/menu-catalog/repository/menu-catalog.repository";

describe("Menu catalog integration", () => {
  let app: INestApplication | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
  });

  it("lets an administrator manage categories, drink prices, option groups and assignments", async () => {
    app = await createTestApp();

    const groupId = await request(app.getHttpServer())
      .post("/backoffice/menu/option-groups")
      .set("x-test-telegram-id", "1001")
      .send({
        name: "Milk",
        selectionMode: "single",
        options: [
          { name: "Regular", priceDelta: 0 },
          { name: "Oat", priceDelta: 60 },
        ],
      })
      .expect(201)
      .then((response) => response.body.optionGroupId as string);

    const categoryId = await request(app.getHttpServer())
      .post("/backoffice/menu/categories")
      .set("x-test-telegram-id", "1001")
      .send({ name: "Coffee", optionGroupRefs: [groupId] })
      .expect(201)
      .then((response) => response.body.menuCategoryId as string);

    await request(app.getHttpServer())
      .post("/backoffice/menu/items")
      .set("x-test-telegram-id", "1001")
      .send({
        menuCategoryId: categoryId,
        name: "Latte",
        itemType: "drink",
        basePrice: 0,
        drinkSizePrices: [
          { size: "S", price: 250 },
          { size: "M", price: 300 },
          { size: "L", price: 350 },
        ],
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.drinkSizePrices).toHaveLength(3);
      });

    await request(app.getHttpServer())
      .get("/backoffice/menu/catalog")
      .set("x-test-telegram-id", "1001")
      .expect(200)
      .expect(({ body }) => {
        expect(body.categories[0].optionGroupRefs).toEqual([groupId]);
        expect(body.items[0].name).toBe("Latte");
        expect(body.optionGroups[0].options).toHaveLength(2);
      });
  });

  it("returns invalid-drink-size-model for an incomplete drink size model", async () => {
    app = await createTestApp();
    const categoryId = await createCategory(app, "Coffee");

    await request(app.getHttpServer())
      .post("/backoffice/menu/items")
      .set("x-test-telegram-id", "1001")
      .send({
        menuCategoryId: categoryId,
        name: "Latte",
        itemType: "drink",
        drinkSizePrices: [
          { size: "S", price: 250 },
          { size: "M", price: 300 },
        ],
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe("invalid-drink-size-model");
      });
  });

  it("returns invalid-option-group-rule for an unknown selection mode", async () => {
    app = await createTestApp();

    await request(app.getHttpServer())
      .post("/backoffice/menu/option-groups")
      .set("x-test-telegram-id", "1001")
      .send({ name: "Milk", selectionMode: "exclusive", options: [] })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe("invalid-option-group-rule");
      });
  });

  it("rejects menu catalog access without administrator menu capability", async () => {
    app = await createTestApp();
    await app
      .get(IdentityAccessService)
      .ensureUserWithRoles("2002", ["barista"]);

    await request(app.getHttpServer())
      .get("/backoffice/menu/catalog")
      .set("x-test-telegram-id", "2002")
      .expect(403)
      .expect(({ body }) => {
        expect(body.message).toBe("backoffice-capability-forbidden");
      });
  });
});

async function createTestApp(): Promise<INestApplication> {
  const config: AccessConfig = {
    environment: "test",
    adminTelegramId: "1001",
    disableTelegramAuth: true,
  };
  const moduleRef = await Test.createTestingModule({
    controllers: [BackofficeController, MenuCatalogController],
    providers: [
      provideAccessConfig(config),
      {
        provide: USER_REPOSITORY,
        useClass: InMemoryUserRepository,
      },
      {
        provide: MENU_CATALOG_REPOSITORY,
        useClass: InMemoryMenuCatalogRepository,
      },
      Reflector,
      IdentityAccessService,
      BootstrapAdministratorService,
      TelegramInitDataVerifier,
      BackofficeAuthService,
      BackofficeAuthGuard,
      MenuCatalogValidator,
      MenuCatalogService,
    ],
  }).compile();

  const testApp = moduleRef.createNestApplication();
  await testApp.init();
  return testApp;
}

async function createCategory(
  app: INestApplication,
  name: string,
): Promise<string> {
  return request(app.getHttpServer())
    .post("/backoffice/menu/categories")
    .set("x-test-telegram-id", "1001")
    .send({ name })
    .expect(201)
    .then((response) => response.body.menuCategoryId as string);
}
