import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    PrismaModule,
    RestaurantsModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
