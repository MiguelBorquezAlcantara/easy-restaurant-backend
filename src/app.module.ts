import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { BranchProductOverridesModule } from './modules/branch-product-overrides/branch-product-overrides.module';
import { BranchesModule } from './modules/branches/branches.module';
import { CustomersModule } from './modules/customers/customers.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentMethodsModule } from './modules/payment-methods/payment-methods.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { ProductCategoriesModule } from './modules/product-categories/product-categories.module';
import { ProductsModule } from './modules/products/products.module';
import { RestaurantTypesModule } from './modules/restaurant-types/restaurant-types.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { RolesModule } from './modules/roles/roles.module';
import { TablesModule } from './modules/tables/tables.module';
import { UsersModule } from './modules/users/users.module';
import { UserBranchesModule } from './modules/user-branches/user-branches.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    BranchProductOverridesModule,
    BranchesModule,
    CustomersModule,
    InventoryModule,
    OrdersModule,
    PaymentMethodsModule,
    PaymentsModule,
    PermissionsModule,
    ProductCategoriesModule,
    ProductsModule,
    RestaurantsModule,
    RestaurantTypesModule,
    RolesModule,
    TablesModule,
    UsersModule,
    UserBranchesModule,
  ],
})
export class AppModule {}
