import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsUUID()
  @IsNotEmpty()
  restaurant_id: string;

  @IsUUID()
  @IsNotEmpty()
  role_id: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  employee_code?: string;

  @IsOptional()
  @IsString()
  pin_code?: string;

  @IsOptional()
  is_active?: boolean;
}
