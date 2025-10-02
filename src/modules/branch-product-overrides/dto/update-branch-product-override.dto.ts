
import { PartialType } from '@nestjs/mapped-types';
import { CreateBranchProductOverrideDto } from './create-branch-product-override.dto';

export class UpdateBranchProductOverrideDto extends PartialType(CreateBranchProductOverrideDto) {}
