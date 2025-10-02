
import { IsOptional, IsString, IsBoolean, IsUUID, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsUUID()
  restaurant_id: string;

  @IsUUID()
  category_id: string;

  @IsString()
  sku: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  base_price: number;

  @IsOptional()
  @IsNumber()
  base_cost?: number;

  @IsOptional()
  @IsNumber()
  tax_rate?: number;

  @IsOptional()
  @IsNumber()
  preparation_time?: number;

  @IsOptional()
  @IsBoolean()
  is_available?: boolean;

  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;

  @IsOptional()
  @IsString()
  image_url?: string;
}
