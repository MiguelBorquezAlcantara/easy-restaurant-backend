
import { Module } from '@nestjs/common';
import { BranchProductOverridesService } from './branch-product-overrides.service';
import { BranchProductOverridesController } from './branch-product-overrides.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BranchProductOverridesController],
  providers: [BranchProductOverridesService],
})
export class BranchProductOverridesModule {}
