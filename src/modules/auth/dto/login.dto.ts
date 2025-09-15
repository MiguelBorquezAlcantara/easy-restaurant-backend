import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  restaurant_code: string;

  @IsNotEmpty()
  employee_code: string;

  @IsNotEmpty()
  password: string;
}
