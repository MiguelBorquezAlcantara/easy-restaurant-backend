import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureExists(id: string) {
    const payment = await this.prisma.payments.findUnique({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    return payment;
  }

  async findAll() {
    return this.prisma.payments.findMany();
  }

  async findById(id: string) {
    return this.ensureExists(id);
  }

  async findByOrder(orderId: string) {
    return this.prisma.payments.findMany({
      where: { order_id: orderId },
    });
  }

  async create(dto: CreatePaymentDto) {
    return this.prisma.payments.create({
      data: {
        order_id: dto.order_id,
        payment_method_id: dto.payment_method_id,
        amount: dto.amount,
        received_amount: dto.received_amount,
        change_amount: dto.change_amount ?? 0,
        reference_number: dto.reference_number,
        status: dto.status ?? 'completed',
        processed_by: dto.processed_by,
        processed_at: dto.processed_at ? new Date(dto.processed_at) : undefined,
        notes: dto.notes,
      },
    });
  }

  async update(id: string, dto: UpdatePaymentDto) {
    await this.ensureExists(id);

    return this.prisma.payments.update({
      where: { id },
      data: {
        ...(dto.order_id ? { order_id: dto.order_id } : {}),
        ...(dto.payment_method_id ? { payment_method_id: dto.payment_method_id } : {}),
        ...(dto.amount ? { amount: dto.amount } : {}),
        ...(dto.received_amount !== undefined ? { received_amount: dto.received_amount } : {}),
        ...(dto.change_amount !== undefined ? { change_amount: dto.change_amount } : {}),
        ...(dto.reference_number ? { reference_number: dto.reference_number } : {}),
        ...(dto.status ? { status: dto.status } : {}),
        ...(dto.processed_by ? { processed_by: dto.processed_by } : {}),
        ...(dto.processed_at ? { processed_at: new Date(dto.processed_at) } : {}),
        ...(dto.notes ? { notes: dto.notes } : {}),
      },
    });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    return this.prisma.payments.delete({ where: { id } });
  }
}
