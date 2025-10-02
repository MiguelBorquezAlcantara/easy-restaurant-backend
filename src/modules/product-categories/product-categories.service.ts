
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';

@Injectable()
export class ProductCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureExists(id: string) {
    const category = await this.prisma.product_categories.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Product category with id ${id} not found`);
    }
    return category;
  }

  async findAll() {
    return this.prisma.product_categories.findMany();
  }

  async findById(id: string) {
    return this.ensureExists(id);
  }

  async findByRestaurant(restaurantId: string) {
    const restaurantExists = await this.prisma.restaurants.findUnique({
      where: { id: restaurantId },
    });
    if (!restaurantExists) {
      throw new NotFoundException(`Restaurant with id ${restaurantId} not found`);
    }

    const categories = await this.prisma.product_categories.findMany({
      where: { restaurant_id: restaurantId },
    });

    if (!categories.length) {
      throw new NotFoundException(
        `No product categories found for restaurant id ${restaurantId}`
      );
    }

    return categories;
  }

  async delete(id: string) {
    await this.ensureExists(id);
    return this.prisma.product_categories.delete({
      where: { id },
    });
  }

  async create(dto: CreateProductCategoryDto) {
    const restaurantExists = await this.prisma.restaurants.findUnique({
      where: { id: dto.restaurant_id },
    });
    if (!restaurantExists) {
      throw new BadRequestException('restaurant_id does not correspond to an existing restaurant');
    }

    return this.prisma.product_categories.create({
      data: {
        restaurant_id: dto.restaurant_id,
        name: dto.name,
        description: dto.description,
        display_order: dto.display_order ?? 0,
        icon: dto.icon,
        color: dto.color,
        is_active: dto.is_active ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateProductCategoryDto) {
    await this.ensureExists(id);

    if (dto.restaurant_id) {
      const restaurantExists = await this.prisma.restaurants.findUnique({
        where: { id: dto.restaurant_id },
      });
      if (!restaurantExists) {
        throw new BadRequestException('restaurant_id does not correspond to an existing restaurant');
      }
    }

    return this.prisma.product_categories.update({
      where: { id },
      data: {
        ...(dto.restaurant_id ? { restaurant_id: dto.restaurant_id } : {}),
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.description ? { description: dto.description } : {}),
        ...(dto.display_order !== undefined ? { display_order: dto.display_order } : {}),
        ...(dto.icon ? { icon: dto.icon } : {}),
        ...(dto.color ? { color: dto.color } : {}),
        ...(dto.is_active !== undefined ? { is_active: dto.is_active } : {}),
      },
    });
  }
}
