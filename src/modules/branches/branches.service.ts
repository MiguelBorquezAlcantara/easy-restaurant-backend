import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchesService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureExists(id: string) {
    const branch = await this.prisma.branches.findUnique({ where: { id } });
    if (!branch) {
      throw new NotFoundException(`Branch with id ${id} not found`);
    }
    return branch;
  }

  async findAll() {
    return this.prisma.branches.findMany();
  }

  async findById(id: string) {
    return this.ensureExists(id);
  }

  async findByRestaurant(restaurantId: string) {
    const restaurant = await this.prisma.restaurants.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${restaurantId} not found`);
    }

    const branches = await this.prisma.branches.findMany({
      where: { restaurant_id: restaurantId },
    });

    if (!branches.length) {
      throw new NotFoundException(`No branches found for restaurant id ${restaurantId}`);
    }
    return branches;
  }

  async delete(id: string) {
    await this.ensureExists(id);
    return this.prisma.branches.delete({
      where: { id },
    });
  }

  async create(dto: CreateBranchDto) {
    const restaurantExists = await this.prisma.restaurants.findUnique({
      where: { id: dto.restaurant_id },
    });

    if (!restaurantExists) {
      throw new BadRequestException('restaurant_id no corresponde a un restaurante existente');
    }

    return this.prisma.branches.create({
      data: {
        restaurant: { connect: { id: dto.restaurant_id } },
        code: dto.code,
        name: dto.name,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        postal_code: dto.postal_code,
        country: dto.country ?? 'México',
        phone: dto.phone,
        email: dto.email,
        is_main: dto.is_main ?? false,
        is_active: dto.is_active ?? true,
        opening_time: dto.opening_time,
        closing_time: dto.closing_time,
      },
    });
  }

  async update(id: string, dto: UpdateBranchDto) {
    await this.ensureExists(id);

    if (dto.restaurant_id) {
      const restaurantExists = await this.prisma.restaurants.findUnique({
        where: { id: dto.restaurant_id },
      });

      if (!restaurantExists) {
        throw new BadRequestException('restaurant_id no corresponde a un restaurante existente');
      }
    }

    return this.prisma.branches.update({
      where: { id },
      data: {
        ...(dto.restaurant_id ? { restaurant: { connect: { id: dto.restaurant_id } } } : {}),
        ...(dto.code ? { code: dto.code } : {}),
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.address ? { address: dto.address } : {}),
        ...(dto.city ? { city: dto.city } : {}),
        ...(dto.state ? { state: dto.state } : {}),
        ...(dto.postal_code ? { postal_code: dto.postal_code } : {}),
        ...(dto.country ? { country: dto.country } : {}),
        ...(dto.phone ? { phone: dto.phone } : {}),
        ...(dto.email ? { email: dto.email } : {}),
        ...(dto.is_main !== undefined ? { is_main: dto.is_main } : {}),
        ...(dto.is_active !== undefined ? { is_active: dto.is_active } : {}),
        ...(dto.opening_time ? { opening_time: dto.opening_time } : {}),
        ...(dto.closing_time ? { closing_time: dto.closing_time } : {}),
      },
    });
  }
}
