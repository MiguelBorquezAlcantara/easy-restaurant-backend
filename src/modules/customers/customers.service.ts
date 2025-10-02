
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureExists(id: string) {
    const customer = await this.prisma.customers.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException(`Customer with id ${id} not found`);
    return customer;
  }

  async findAll() {
    return this.prisma.customers.findMany();
  }

  async findById(id: string) {
    return this.ensureExists(id);
  }

  async findByRestaurant(restaurantId: string) {
    const restaurantExists = await this.prisma.restaurants.findUnique({ where: { id: restaurantId } });
    if (!restaurantExists) throw new NotFoundException(`Restaurant with id ${restaurantId} not found`);

    const customers = await this.prisma.customers.findMany({ where: { restaurant_id: restaurantId } });
    if (!customers.length) throw new NotFoundException(`No customers found for restaurant id ${restaurantId}`);
    return customers;
  }

  async delete(id: string) {
    await this.ensureExists(id);
    return this.prisma.customers.delete({ where: { id } });
  }

  async create(dto: CreateCustomerDto) {
    const restaurantExists = await this.prisma.restaurants.findUnique({ where: { id: dto.restaurant_id } });
    if (!restaurantExists) throw new BadRequestException('restaurant_id does not exist');

    // Validación de unicidad email+restaurant_id
    if (dto.email) {
      const existing = await this.prisma.customers.findUnique({
        where: { restaurant_id_email: { restaurant_id: dto.restaurant_id, email: dto.email } },
      });
      if (existing) throw new BadRequestException('Customer with this email already exists for this restaurant');
    }

    return this.prisma.customers.create({
      data: {
        restaurant_id: dto.restaurant_id,
        email: dto.email,
        phone: dto.phone,
        first_name: dto.first_name,
        last_name: dto.last_name,
        tax_id: dto.tax_id,
        address: dto.address,
        birth_date: dto.birth_date ? new Date(dto.birth_date) : undefined,
        notes: dto.notes,
        is_active: dto.is_active ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateCustomerDto) {
    await this.ensureExists(id);

    if (dto.restaurant_id) {
      const restaurantExists = await this.prisma.restaurants.findUnique({ where: { id: dto.restaurant_id } });
      if (!restaurantExists) throw new BadRequestException('restaurant_id does not exist');
    }

    return this.prisma.customers.update({
      where: { id },
      data: {
        ...(dto.restaurant_id ? { restaurant_id: dto.restaurant_id } : {}),
        ...(dto.email ? { email: dto.email } : {}),
        ...(dto.phone ? { phone: dto.phone } : {}),
        ...(dto.first_name ? { first_name: dto.first_name } : {}),
        ...(dto.last_name ? { last_name: dto.last_name } : {}),
        ...(dto.tax_id ? { tax_id: dto.tax_id } : {}),
        ...(dto.address ? { address: dto.address } : {}),
        ...(dto.birth_date ? { birth_date: new Date(dto.birth_date) } : {}),
        ...(dto.notes ? { notes: dto.notes } : {}),
        ...(dto.is_active !== undefined ? { is_active: dto.is_active } : {}),
      },
    });
  }
}
