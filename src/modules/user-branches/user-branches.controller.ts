// src/modules/user-branches/user-branches.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UserBranchesService } from './user-branches.service';
import { CreateUserBranchDto } from './dto/create-user-branch.dto';
import { UpdateUserBranchDto } from './dto/update-user-branch.dto';

@Controller('user-branches')
export class UserBranchesController {
  constructor(private readonly userBranchesService: UserBranchesService) {}

  @Get()
  async getAll() {
    return this.userBranchesService.findAll();
  }

  @Get(':user_id/:branch_id')
  async getById(@Param('user_id') user_id: string, @Param('branch_id') branch_id: string) {
    return this.userBranchesService.findOne(user_id, branch_id);
  }

  @Post()
  async create(@Body() dto: CreateUserBranchDto) {
    return this.userBranchesService.create(dto);
  }

  @Put(':user_id/:branch_id')
  async update(
    @Param('user_id') user_id: string,
    @Param('branch_id') branch_id: string,
    @Body() dto: UpdateUserBranchDto,
  ) {
    return this.userBranchesService.update(user_id, branch_id, dto);
  }

  @Delete(':user_id/:branch_id')
  async remove(@Param('user_id') user_id: string, @Param('branch_id') branch_id: string) {
    return this.userBranchesService.delete(user_id, branch_id);
  }
}
