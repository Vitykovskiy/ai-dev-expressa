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
import { AvailableSlotsService } from "../src/slot-settings/available-slots.service";
import { CustomerSlotsController } from "../src/slot-settings/customer-slots.controller";
import { SlotSettingsValidator } from "../src/slot-settings/domain/slot-settings.validator";
import { SlotSettingsController } from "../src/slot-settings/slot-settings.controller";
import { SlotSettingsService } from "../src/slot-settings/slot-settings.service";
import { InMemorySlotSettingsRepository } from "../src/slot-settings/repository/in-memory-slot-settings.repository";
import { SLOT_SETTINGS_REPOSITORY } from "../src/slot-settings/repository/slot-settings.repository";

describe("Slot settings integration", () => {
  let app: INestApplication | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
  });

  it("returns default slot settings before the first save", async () => {
    app = await createTestApp();

    await request(app.getHttpServer())
      .get("/backoffice/settings/slot-settings")
      .set("x-test-telegram-id", "1001")
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          workingHoursOpen: "09:00",
          workingHoursClose: "20:00",
          slotCapacity: 5,
        });
      });
  });

  it("saves slot settings and applies them to customer slot generation", async () => {
    app = await createTestApp();

    await request(app.getHttpServer())
      .put("/backoffice/settings/slot-settings")
      .set("x-test-telegram-id", "1001")
      .send({
        workingHoursOpen: "08:00",
        workingHoursClose: "08:30",
        slotCapacity: 6,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          workingHoursOpen: "08:00",
          workingHoursClose: "08:30",
          slotCapacity: 6,
        });
      });

    await request(app.getHttpServer())
      .get("/customer/slots")
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(3);
        expect(body).toEqual([
          expect.objectContaining({
            slotStart: "08:00",
            slotEnd: "08:10",
            capacityLimit: 6,
            activeOrderCount: 0,
          }),
          expect.objectContaining({
            slotStart: "08:10",
            slotEnd: "08:20",
            capacityLimit: 6,
            activeOrderCount: 0,
          }),
          expect.objectContaining({
            slotStart: "08:20",
            slotEnd: "08:30",
            capacityLimit: 6,
            activeOrderCount: 0,
          }),
        ]);
      });
  });

  it("preserves the current working hours when only slot capacity changes", async () => {
    app = await createTestApp();

    await request(app.getHttpServer())
      .put("/backoffice/settings/slot-settings")
      .set("x-test-telegram-id", "1001")
      .send({
        workingHoursOpen: "07:00",
        workingHoursClose: "11:00",
        slotCapacity: 5,
      })
      .expect(200);

    await request(app.getHttpServer())
      .put("/backoffice/settings/slot-settings")
      .set("x-test-telegram-id", "1001")
      .send({
        slotCapacity: 7,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          workingHoursOpen: "07:00",
          workingHoursClose: "11:00",
          slotCapacity: 7,
        });
      });
  });

  it("returns invalid-working-hours for an invalid operating window", async () => {
    app = await createTestApp();

    await request(app.getHttpServer())
      .put("/backoffice/settings/slot-settings")
      .set("x-test-telegram-id", "1001")
      .send({
        workingHoursOpen: "18:00",
        workingHoursClose: "17:50",
        slotCapacity: 5,
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe("invalid-working-hours");
      });
  });

  it("returns invalid-slot-capacity for an invalid capacity", async () => {
    app = await createTestApp();

    await request(app.getHttpServer())
      .put("/backoffice/settings/slot-settings")
      .set("x-test-telegram-id", "1001")
      .send({
        workingHoursOpen: "09:00",
        workingHoursClose: "20:00",
        slotCapacity: 0,
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe("invalid-slot-capacity");
      });
  });

  it("rejects access to slot settings without settings capability", async () => {
    app = await createTestApp();
    await app
      .get(IdentityAccessService)
      .ensureUserWithRoles("2002", ["barista"]);

    await request(app.getHttpServer())
      .get("/backoffice/settings/slot-settings")
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
    controllers: [
      BackofficeController,
      SlotSettingsController,
      CustomerSlotsController,
    ],
    providers: [
      provideAccessConfig(config),
      {
        provide: USER_REPOSITORY,
        useClass: InMemoryUserRepository,
      },
      {
        provide: SLOT_SETTINGS_REPOSITORY,
        useClass: InMemorySlotSettingsRepository,
      },
      Reflector,
      IdentityAccessService,
      BootstrapAdministratorService,
      TelegramInitDataVerifier,
      BackofficeAuthService,
      BackofficeAuthGuard,
      SlotSettingsValidator,
      AvailableSlotsService,
      SlotSettingsService,
    ],
  }).compile();

  const testApp = moduleRef.createNestApplication();
  await testApp.init();
  return testApp;
}
