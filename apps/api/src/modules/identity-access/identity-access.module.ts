import { Module } from '@nestjs/common';

import { PrismaService } from '../../shared/persistence/prisma.service';
import { IdentityAccessService } from './identity-access.service';
import { IDENTITY_ACCESS_REPOSITORY } from './identity-access.types';
import { PrismaIdentityAccessRepository } from './prisma-identity-access.repository';

@Module({
  providers: [
    PrismaService,
    IdentityAccessService,
    PrismaIdentityAccessRepository,
    {
      provide: IDENTITY_ACCESS_REPOSITORY,
      useExisting: PrismaIdentityAccessRepository,
    },
  ],
  exports: [IdentityAccessService, IDENTITY_ACCESS_REPOSITORY],
})
export class IdentityAccessModule {}
