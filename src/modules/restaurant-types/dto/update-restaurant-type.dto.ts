import { IsOptional, IsString } from 'class-validator';

export class UpdateRestaurantTypeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
