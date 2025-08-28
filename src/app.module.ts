import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';

@Module({
  imports: [PrismaModule, RestaurantsModule],
})
export class AppModule {}
