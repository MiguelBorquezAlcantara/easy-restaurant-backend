
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureExists(id: string) {
    const order = await this.prisma.orders.findUnique({ where: { id } });
    if (!order) throw new NotFoundException(`Order with id ${id} not found`);
    return order;
  }

  async findAll() {
    return this.prisma.orders.findMany();
  }

  async findById(id: string) {
    return this.ensureExists(id);
  }

  async findByBranch(branchId: string) {
    const branchExists = await this.prisma.branches.findUnique({ where: { id: branchId } });
    if (!branchExists) throw new NotFoundException(`Branch with id ${branchId} not found`);

    const orders = await this.prisma.orders.findMany({ where: { branch_id: branchId } });
    if (!orders.length) throw new NotFoundException(`No orders found for branch id ${branchId}`);
    return orders;
  }

  async delete(id: string) {
    await this.ensureExists(id);
    return this.prisma.orders.delete({ where: { id } });
  }

  async create(dto: CreateOrderDto) {
    const branchExists = await this.prisma.branches.findUnique({ where: { id: dto.branch_id } });
    if (!branchExists) throw new BadRequestException('branch_id does not exist');

    return this.prisma.orders.create({
      data: {
        branch_id: dto.branch_id,
        order_number: dto.order_number,
        table_id: dto.table_id,
        customer_id: dto.customer_id,
        waiter_id: dto.waiter_id,
        cashier_id: dto.cashier_id,
        order_type: dto.order_type,
        status: dto.status ?? 'pending',
        subtotal: dto.subtotal ?? 0,
        tax_amount: dto.tax_amount ?? 0,
        discount_amount: dto.discount_amount ?? 0,
        tip_amount: dto.tip_amount ?? 0,
        total_amount: dto.total_amount ?? 0,
        notes: dto.notes,
        kitchen_notes: dto.kitchen_notes,
        customer_count: dto.customer_count ?? 1,
        preparation_time: dto.preparation_time,
        confirmed_at: dto.confirmed_at ? new Date(dto.confirmed_at) : undefined,
        ready_at: dto.ready_at ? new Date(dto.ready_at) : undefined,
        delivered_at: dto.delivered_at ? new Date(dto.delivered_at) : undefined,
        completed_at: dto.completed_at ? new Date(dto.completed_at) : undefined,
        cancelled_at: dto.cancelled_at ? new Date(dto.cancelled_at) : undefined,
        cancelled_reason: dto.cancelled_reason,
      },
    });
  }

  async update(id: string, dto: UpdateOrderDto) {
    await this.ensureExists(id);

    return this.prisma.orders.update({
      where: { id },
      data: {
        ...(dto.branch_id ? { branch_id: dto.branch_id } : {}),
        ...(dto.order_number ? { order_number: dto.order_number } : {}),
        ...(dto.table_id ? { table_id: dto.table_id } : {}),
        ...(dto.customer_id ? { customer_id: dto.customer_id } : {}),
        ...(dto.waiter_id ? { waiter_id: dto.waiter_id } : {}),
        ...(dto.cashier_id ? { cashier_id: dto.cashier_id } : {}),
        ...(dto.order_type ? { order_type: dto.order_type } : {}),
        ...(dto.status ? { status: dto.status } : {}),
        ...(dto.subtotal !== undefined ? { subtotal: dto.subtotal } : {}),
        ...(dto.tax_amount !== undefined ? { tax_amount: dto.tax_amount } : {}),
        ...(dto.discount_amount !== undefined ? { discount_amount: dto.discount_amount } : {}),
        ...(dto.tip_amount !== undefined ? { tip_amount: dto.tip_amount } : {}),
        ...(dto.total_amount !== undefined ? { total_amount: dto.total_amount } : {}),
        ...(dto.notes ? { notes: dto.notes } : {}),
        ...(dto.kitchen_notes ? { kitchen_notes: dto.kitchen_notes } : {}),
        ...(dto.customer_count !== undefined ? { customer_count: dto.customer_count } : {}),
        ...(dto.preparation_time !== undefined ? { preparation_time: dto.preparation_time } : {}),
        ...(dto.confirmed_at ? { confirmed_at: new Date(dto.confirmed_at) } : {}),
        ...(dto.ready_at ? { ready_at: new Date(dto.ready_at) } : {}),
        ...(dto.delivered_at ? { delivered_at: new Date(dto.delivered_at) } : {}),
        ...(dto.completed_at ? { completed_at: new Date(dto.completed_at) } : {}),
        ...(dto.cancelled_at ? { cancelled_at: new Date(dto.cancelled_at) } : {}),
        ...(dto.cancelled_reason ? { cancelled_reason: dto.cancelled_reason } : {}),
      },
    });
  }
}
