import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { RestaurantTypesService } from './restaurant-types.service';
import { CreateRestaurantTypeDto } from './dto/create-restaurant-type.dto';
import { UpdateRestaurantTypeDto } from './dto/update-restaurant-type.dto';

@Controller('restaurant-types')
export class RestaurantTypesController {
  constructor(private restaurantTypesService: RestaurantTypesService) {}

  @Get()
  async getAll() {
    return this.restaurantTypesService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.restaurantTypesService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateRestaurantTypeDto) {
    return this.restaurantTypesService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRestaurantTypeDto) {
    return this.restaurantTypesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.restaurantTypesService.delete(id);
  }
}
