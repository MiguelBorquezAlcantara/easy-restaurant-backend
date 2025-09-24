// src/modules/user-branches/user-branches.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserBranchDto } from './dto/create-user-branch.dto';
import { UpdateUserBranchDto } from './dto/update-user-branch.dto';

@Injectable()
export class UserBranchesService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureExists(user_id: string, branch_id: string) {
    const userBranch = await this.prisma.user_branches.findUnique({
      where: { user_id_branch_id: { user_id, branch_id } },
    });
    if (!userBranch) {
      throw new NotFoundException(`UserBranch with user_id ${user_id} and branch_id ${branch_id} not found`);
    }
    return userBranch;
  }

  async findAll() {
    return this.prisma.user_branches.findMany();
  }

  async findOne(user_id: string, branch_id: string) {
    return this.ensureExists(user_id, branch_id);
  }

  async create(dto: CreateUserBranchDto) {
    const exists = await this.prisma.user_branches.findUnique({
      where: { user_id_branch_id: { user_id: dto.user_id, branch_id: dto.branch_id } },
    });
    if (exists) {
      throw new BadRequestException(`UserBranch with user_id ${dto.user_id} and branch_id ${dto.branch_id} already exists`);
    }

    return this.prisma.user_branches.create({
      data: {
        user_id: dto.user_id,
        branch_id: dto.branch_id,
        is_default: dto.is_default ?? false,
      },
    });
  }

  async update(user_id: string, branch_id: string, dto: UpdateUserBranchDto) {
    await this.ensureExists(user_id, branch_id);

    return this.prisma.user_branches.update({
      where: { user_id_branch_id: { user_id, branch_id } },
      data: {
        ...(dto.is_default !== undefined ? { is_default: dto.is_default } : {}),
      },
    });
  }

  async delete(user_id: string, branch_id: string) {
    await this.ensureExists(user_id, branch_id);
    return this.prisma.user_branches.delete({
      where: { user_id_branch_id: { user_id, branch_id } },
    });
  }
}
