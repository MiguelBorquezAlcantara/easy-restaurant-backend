import { IsOptional, IsString } from 'class-validator';

export class CreateRestaurantTypeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
