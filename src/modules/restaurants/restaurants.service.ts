import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureExists(id: string) {
    const restaurant = await this.prisma.restaurants.findUnique({
      where: { id },
    });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }
    return restaurant;
  }

  async findAll() {
    return this.prisma.restaurants.findMany();
  }

  async findById(id: string) {
    return this.ensureExists(id);
  }

  async findByType(typeId: string) {
    const typeExists = await this.prisma.restaurant_types.findUnique({
      where: { id: typeId },
    });
    if (!typeExists) {
      throw new NotFoundException(
        `Restaurant type with id ${typeId} not found`,
      );
    }

    const restaurants = await this.prisma.restaurants.findMany({
      where: { restaurant_type_id: typeId },
    });

    if (!restaurants.length) {
      throw new NotFoundException(
        `No restaurants found for restaurant type id ${typeId}`,
      );
    }
    return restaurants;
  }

  async delete(id: string) {
    await this.ensureExists(id);
    return this.prisma.restaurants.delete({
      where: { id },
    });
  }

  async create(dto: CreateRestaurantDto) {
    if (dto.restaurant_type_id) {
      const exists = await this.prisma.restaurant_types.findUnique({
        where: { id: dto.restaurant_type_id },
      });
      if (!exists) {
        throw new BadRequestException(
          'restaurant_type_id no corresponde a un tipo existente',
        );
      }
    }

    return this.prisma.restaurants.create({
      data: {
        code: dto.code,
        name: dto.name,
        legal_name: dto.legal_name,
        tax_id: dto.tax_id,
        email: dto.email,
        phone: dto.phone,
        logo_url: dto.logo_url,
        is_active: dto.is_active ?? true,
        subscription_ends_at: dto.subscription_ends_at
          ? new Date(dto.subscription_ends_at)
          : undefined,
        ...(dto.restaurant_type_id
          ? { restaurant_type: { connect: { id: dto.restaurant_type_id } } }
          : {}),
      },
    });
  }
}
