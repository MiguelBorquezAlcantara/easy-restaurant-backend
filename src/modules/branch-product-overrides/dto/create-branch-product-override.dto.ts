
import { IsOptional, IsString, IsUUID, IsBoolean, IsNumber } from 'class-validator';

export class CreateBranchProductOverrideDto {
  @IsUUID()
  branch_id: string;

  @IsUUID()
  product_id: string;

  @IsOptional()
  @IsString()
  custom_name?: string;

  @IsOptional()
  @IsNumber()
  custom_price?: number;

  @IsOptional()
  @IsNumber()
  custom_cost?: number;

  @IsOptional()
  @IsBoolean()
  is_available?: boolean;
}
