// src/modules/user-branches/dto/create-user-branch.dto.ts
import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class CreateUserBranchDto {
  @IsString()
  user_id: string;

  @IsString()
  branch_id: string;

  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
