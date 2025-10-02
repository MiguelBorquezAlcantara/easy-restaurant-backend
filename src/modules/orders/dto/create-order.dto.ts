
import { IsOptional, IsString, IsUUID, IsNumber, IsInt, IsDateString } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  branch_id: string;

  @IsString()
  order_number: string;

  @IsOptional()
  @IsUUID()
  table_id?: string;

  @IsOptional()
  @IsUUID()
  customer_id?: string;

  @IsOptional()
  @IsUUID()
  waiter_id?: string;

  @IsOptional()
  @IsUUID()
  cashier_id?: string;

  @IsString()
  order_type: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  subtotal?: number;

  @IsOptional()
  @IsNumber()
  tax_amount?: number;

  @IsOptional()
  @IsNumber()
  discount_amount?: number;

  @IsOptional()
  @IsNumber()
  tip_amount?: number;

  @IsOptional()
  @IsNumber()
  total_amount?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  kitchen_notes?: string;

  @IsOptional()
  @IsInt()
  customer_count?: number;

  @IsOptional()
  @IsInt()
  preparation_time?: number;

  @IsOptional()
  @IsDateString()
  confirmed_at?: string;

  @IsOptional()
  @IsDateString()
  ready_at?: string;

  @IsOptional()
  @IsDateString()
  delivered_at?: string;

  @IsOptional()
  @IsDateString()
  completed_at?: string;

  @IsOptional()
  @IsDateString()
  cancelled_at?: string;

  @IsOptional()
  @IsString()
  cancelled_reason?: string;
}
