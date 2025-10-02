
import { IsOptional, IsString, IsBoolean, IsInt, IsUUID } from 'class-validator';

export class CreateProductCategoryDto {
  @IsUUID()
  restaurant_id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  display_order?: number;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
