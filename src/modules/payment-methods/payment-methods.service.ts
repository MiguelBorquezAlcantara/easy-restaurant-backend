import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@Injectable()
export class PaymentMethodsService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureExists(id: string) {
    const method = await this.prisma.payment_methods.findUnique({ where: { id } });
    if (!method) {
      throw new NotFoundException(`Payment method with id ${id} not found`);
    }
    return method;
  }

  async findAll() {
    return this.prisma.payment_methods.findMany();
  }

  async findById(id: string) {
    return this.ensureExists(id);
  }

  async create(dto: CreatePaymentMethodDto) {
    return this.prisma.payment_methods.create({
      data: {
        name: dto.name,
        display_name: dto.display_name,
        icon: dto.icon,
        is_active: dto.is_active ?? true,
        requires_reference: dto.requires_reference ?? false,
      },
    });
  }

  async update(id: string, dto: UpdatePaymentMethodDto) {
    await this.ensureExists(id);

    return this.prisma.payment_methods.update({
      where: { id },
      data: {
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.display_name ? { display_name: dto.display_name } : {}),
        ...(dto.icon ? { icon: dto.icon } : {}),
        ...(dto.is_active !== undefined ? { is_active: dto.is_active } : {}),
        ...(dto.requires_reference !== undefined ? { requires_reference: dto.requires_reference } : {}),
      },
    });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    return this.prisma.payment_methods.delete({ where: { id } });
  }
}
