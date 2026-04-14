import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "../../src/app.module";
import { DomainExceptionFilter } from "../../src/common/http/domain-exception.filter";

describe("DU-01 admin API smoke", () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    process.env.ADMIN_TELEGRAM_ID = "100";
    process.env.DISABLE_TG_AUTH = "true";
    process.env.PERSISTENCE_DRIVER = "memory";
    delete process.env.TG_BACKOFFICE_BOT_TOKEN;

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("api");
    app.useGlobalFilters(new DomainExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("bootstraps main administrator session in test mode", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/auth/session")
      .set("x-test-telegram-id", "100")
      .expect(200);

    expect(response.body.user.telegramId).toBe("100");
    expect(response.body.user.roles).toEqual(["administrator"]);
    expect(response.body.testMode).toBe(true);
  });

  it("changes role and blocks user", async () => {
    const roleResponse = await request(app.getHttpServer())
      .post("/api/users/roles")
      .set("x-test-telegram-id", "100")
      .send({
        targetTelegramId: "200",
        role: "barista"
      })
      .expect(201);

    expect(roleResponse.body.user.roles).toEqual(["barista"]);

    const blockResponse = await request(app.getHttpServer())
      .post("/api/users/block")
      .set("x-test-telegram-id", "100")
      .send({
        targetTelegramId: "200"
      })
      .expect(201);

    expect(blockResponse.body.user.blocked).toBe(true);
  });

  it("saves menu catalog", async () => {
    const payload = {
      catalog: {
        categories: [
          {
            menuCategoryId: "coffee",
            name: "Coffee",
            optionGroupIds: ["milk"]
          }
        ],
        optionGroups: [
          {
            optionGroupId: "milk",
            name: "Milk",
            selectionMode: "single",
            options: [
              {
                optionId: "oat",
                name: "Oat",
                priceDelta: 30,
                availability: true
              }
            ]
          }
        ],
        items: [
          {
            menuItemId: "latte",
            menuCategoryId: "coffee",
            name: "Latte",
            itemType: "drink",
            basePrice: null,
            availability: true,
            sizePrices: [
              { size: "S", price: 180 },
              { size: "M", price: 220 },
              { size: "L", price: 260 }
            ]
          }
        ]
      }
    };

    await request(app.getHttpServer())
      .put("/api/menu")
      .set("x-test-telegram-id", "100")
      .send(payload)
      .expect(200);

    const response = await request(app.getHttpServer())
      .get("/api/menu")
      .set("x-test-telegram-id", "100")
      .expect(200);

    expect(response.body.catalog.categories[0].name).toBe("Coffee");
  });

  it("saves slot settings", async () => {
    const payload = {
      settings: {
        workingHours: {
          startTime: "10:00",
          endTime: "18:00"
        },
        slotCapacity: 7
      }
    };

    await request(app.getHttpServer())
      .put("/api/slot-settings")
      .set("x-test-telegram-id", "100")
      .send(payload)
      .expect(200);

    const response = await request(app.getHttpServer())
      .get("/api/slot-settings")
      .set("x-test-telegram-id", "100")
      .expect(200);

    expect(response.body.settings).toEqual(payload.settings);
  });
});
