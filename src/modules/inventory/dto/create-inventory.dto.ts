
import { IsOptional, IsString, IsUUID, IsNumber } from 'class-validator';

export class CreateInventoryDto {
  @IsUUID()
  branch_id: string;

  @IsUUID()
  product_id: string;

  @IsOptional()
  @IsNumber()
  current_stock?: number;

  @IsOptional()
  @IsNumber()
  min_stock?: number;

  @IsOptional()
  @IsNumber()
  max_stock?: number;

  @IsOptional()
  @IsString()
  unit_measure?: string;

  @IsOptional()
  last_restock_at?: string; // ISO date string
}
