import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { BranchesModule } from './modules/branches/branches.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RestaurantTypesModule } from './modules/restaurant-types/restaurant-types.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { UserBranchesModule } from './modules/user-branches/user-branches.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    BranchesModule,
    PermissionsModule,
    RestaurantsModule,
    RestaurantTypesModule,
    RolesModule,
    UsersModule,
    UserBranchesModule,
  ],
})
export class AppModule {}
