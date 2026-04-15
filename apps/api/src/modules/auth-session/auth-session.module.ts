import { Module } from '@nestjs/common';

import { IdentityAccessModule } from '../identity-access/identity-access.module';
import { AuthSessionController } from './auth-session.controller';
import { AuthSessionService } from './auth-session.service';
import { TelegramInitDataValidator } from './telegram-init-data-validator';

@Module({
  imports: [IdentityAccessModule],
  controllers: [AuthSessionController],
  providers: [AuthSessionService, TelegramInitDataValidator],
})
export class AuthSessionModule {}
