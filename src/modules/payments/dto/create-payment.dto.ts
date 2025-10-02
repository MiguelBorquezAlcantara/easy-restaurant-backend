import { IsUUID, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  order_id: string;

  @IsUUID()
  payment_method_id: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  received_amount?: number;

  @IsOptional()
  @IsNumber()
  change_amount?: number;

  @IsOptional()
  @IsString()
  reference_number?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsUUID()
  processed_by?: string;

  @IsOptional()
  @IsDateString()
  processed_at?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
