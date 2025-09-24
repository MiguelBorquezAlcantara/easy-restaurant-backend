import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.branchesService.findById(id);
  }

  @Get('restaurant/:restaurantId')
  async getByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.branchesService.findByRestaurant(restaurantId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.branchesService.delete(id);
  }

  @Get()
  async getAll() {
    return this.branchesService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateBranchDto) {
    return this.branchesService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBranchDto) {
    return this.branchesService.update(id, dto);
  }
}
