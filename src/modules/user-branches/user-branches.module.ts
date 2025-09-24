// src/modules/user-branches/user-branches.module.ts
import { Module } from '@nestjs/common';
import { UserBranchesService } from './user-branches.service';
import { UserBranchesController } from './user-branches.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserBranchesController],
  providers: [UserBranchesService],
})
export class UserBranchesModule {}
