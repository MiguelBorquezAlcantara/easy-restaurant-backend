import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRestaurantTypeDto } from './dto/create-restaurant-type.dto';
import { UpdateRestaurantTypeDto } from './dto/update-restaurant-type.dto';

@Injectable()
export class RestaurantTypesService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureExists(id: string) {
    const type = await this.prisma.restaurant_types.findUnique({ where: { id } });
    if (!type) {
      throw new NotFoundException(`Restaurant type with id ${id} not found`);
    }
    return type;
  }

  async findAll() {
    return this.prisma.restaurant_types.findMany();
  }

  async findById(id: string) {
    return this.ensureExists(id);
  }

  async create(dto: CreateRestaurantTypeDto) {
    return this.prisma.restaurant_types.create({
      data: {
        name: dto.name,
        description: dto.description,
      },
    });
  }

  async update(id: string, dto: UpdateRestaurantTypeDto) {
    await this.ensureExists(id);
    return this.prisma.restaurant_types.update({
      where: { id },
      data: {
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.description ? { description: dto.description } : {}),
        updated_at: new Date(),
      },
    });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    return this.prisma.restaurant_types.delete({ where: { id } });
  }
}
