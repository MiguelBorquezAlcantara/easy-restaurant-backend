import { Module } from '@nestjs/common';
import { RestaurantTypesService } from './restaurant-types.service';
import { RestaurantTypesController } from './restaurant-types.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RestaurantTypesController],
  providers: [RestaurantTypesService],
})
export class RestaurantTypesModule {}
