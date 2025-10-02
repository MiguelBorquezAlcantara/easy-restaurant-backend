
import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { BranchProductOverridesService } from './branch-product-overrides.service';
import { CreateBranchProductOverrideDto } from './dto/create-branch-product-override.dto';
import { UpdateBranchProductOverrideDto } from './dto/update-branch-product-override.dto';

@Controller('branch-product-overrides')
export class BranchProductOverridesController {
  constructor(private readonly service: BranchProductOverridesService) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get('branch/:branchId')
  async getByBranch(@Param('branchId') branchId: string) {
    return this.service.findByBranch(branchId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Get()
  async getAll() {
    return this.service.findAll();
  }

  @Post()
  async create(@Body() dto: CreateBranchProductOverrideDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBranchProductOverrideDto) {
    return this.service.update(id, dto);
  }
}
