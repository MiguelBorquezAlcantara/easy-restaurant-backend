// src/modules/restaurants/dto/create-restaurant.dto.ts
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsUUID,
  IsEmail,
  IsDateString,
} from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  legal_name?: string;

  @IsOptional()
  @IsString()
  tax_id?: string;

  @IsOptional()
  @IsUUID()
  restaurant_type_id?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  logo_url?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsDateString()
  subscription_ends_at?: string;
}
