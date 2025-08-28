import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.restaurantsService.findById(id);
  }

  @Get('type/:typeId')
  async getByType(@Param('typeId') typeId: string) {
    return this.restaurantsService.findByType(typeId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.restaurantsService.delete(id);
  }

  @Get()
  async getAll() {
    return await this.restaurantsService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateRestaurantDto) {
    return await this.restaurantsService.create(dto);
  }
}
