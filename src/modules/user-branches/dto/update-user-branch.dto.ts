// src/modules/user-branches/dto/update-user-branch.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserBranchDto } from './create-user-branch.dto';

export class UpdateUserBranchDto extends PartialType(CreateUserBranchDto) {}
