
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureExists(id: string) {
    const product = await this.prisma.products.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  async findAll() {
    return this.prisma.products.findMany();
  }

  async findById(id: string) {
    return this.ensureExists(id);
  }

  async findByRestaurant(restaurantId: string) {
    const restaurantExists = await this.prisma.restaurants.findUnique({ where: { id: restaurantId } });
    if (!restaurantExists) throw new NotFoundException(`Restaurant with id ${restaurantId} not found`);

    const products = await this.prisma.products.findMany({ where: { restaurant_id: restaurantId } });
    if (!products.length) throw new NotFoundException(`No products found for restaurant id ${restaurantId}`);

    return products;
  }

  async findByCategory(categoryId: string) {
    const categoryExists = await this.prisma.product_categories.findUnique({ where: { id: categoryId } });
    if (!categoryExists) throw new NotFoundException(`Category with id ${categoryId} not found`);

    const products = await this.prisma.products.findMany({ where: { category_id: categoryId } });
    if (!products.length) throw new NotFoundException(`No products found for category id ${categoryId}`);

    return products;
  }

  async delete(id: string) {
    await this.ensureExists(id);
    return this.prisma.products.delete({ where: { id } });
  }

  async create(dto: CreateProductDto) {
    const restaurantExists = await this.prisma.restaurants.findUnique({ where: { id: dto.restaurant_id } });
    if (!restaurantExists) throw new BadRequestException('restaurant_id does not exist');

    const categoryExists = await this.prisma.product_categories.findUnique({ where: { id: dto.category_id } });
    if (!categoryExists) throw new BadRequestException('category_id does not exist');

    return this.prisma.products.create({
      data: {
        restaurant_id: dto.restaurant_id,
        category_id: dto.category_id,
        sku: dto.sku,
        name: dto.name,
        description: dto.description,
        base_price: dto.base_price,
        base_cost: dto.base_cost,
        tax_rate: dto.tax_rate ?? 16.0,
        preparation_time: dto.preparation_time,
        is_available: dto.is_available ?? true,
        is_featured: dto.is_featured ?? false,
        image_url: dto.image_url,
      },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.ensureExists(id);

    if (dto.restaurant_id) {
      const restaurantExists = await this.prisma.restaurants.findUnique({ where: { id: dto.restaurant_id } });
      if (!restaurantExists) throw new BadRequestException('restaurant_id does not exist');
    }

    if (dto.category_id) {
      const categoryExists = await this.prisma.product_categories.findUnique({ where: { id: dto.category_id } });
      if (!categoryExists) throw new BadRequestException('category_id does not exist');
    }

    return this.prisma.products.update({
      where: { id },
      data: {
        ...(dto.restaurant_id ? { restaurant_id: dto.restaurant_id } : {}),
        ...(dto.category_id ? { category_id: dto.category_id } : {}),
        ...(dto.sku ? { sku: dto.sku } : {}),
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.description ? { description: dto.description } : {}),
        ...(dto.base_price !== undefined ? { base_price: dto.base_price } : {}),
        ...(dto.base_cost !== undefined ? { base_cost: dto.base_cost } : {}),
        ...(dto.tax_rate !== undefined ? { tax_rate: dto.tax_rate } : {}),
        ...(dto.preparation_time !== undefined ? { preparation_time: dto.preparation_time } : {}),
        ...(dto.is_available !== undefined ? { is_available: dto.is_available } : {}),
        ...(dto.is_featured !== undefined ? { is_featured: dto.is_featured } : {}),
        ...(dto.image_url ? { image_url: dto.image_url } : {}),
      },
    });
  }
}
