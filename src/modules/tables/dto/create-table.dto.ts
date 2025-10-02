
import { IsOptional, IsString, IsUUID, IsInt, IsBoolean } from 'class-validator';

export class CreateTableDto {
  @IsUUID()
  branch_id: string;

  @IsString()
  number: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  capacity?: number;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  qr_code?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
