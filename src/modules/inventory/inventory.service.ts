
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureExists(id: string) {
    const record = await this.prisma.inventory.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Inventory record with id ${id} not found`);
    return record;
  }

  async findAll() {
    return this.prisma.inventory.findMany();
  }

  async findById(id: string) {
    return this.ensureExists(id);
  }

  async findByBranch(branchId: string) {
    const branchExists = await this.prisma.branches.findUnique({ where: { id: branchId } });
    if (!branchExists) throw new NotFoundException(`Branch with id ${branchId} not found`);

    const records = await this.prisma.inventory.findMany({ where: { branch_id: branchId } });
    if (!records.length) throw new NotFoundException(`No inventory records found for branch id ${branchId}`);
    return records;
  }

  async findByProduct(productId: string) {
    const productExists = await this.prisma.products.findUnique({ where: { id: productId } });
    if (!productExists) throw new NotFoundException(`Product with id ${productId} not found`);

    const records = await this.prisma.inventory.findMany({ where: { product_id: productId } });
    if (!records.length) throw new NotFoundException(`No inventory records found for product id ${productId}`);
    return records;
  }

  async delete(id: string) {
    await this.ensureExists(id);
    return this.prisma.inventory.delete({ where: { id } });
  }

  async create(dto: CreateInventoryDto) {
    const branchExists = await this.prisma.branches.findUnique({ where: { id: dto.branch_id } });
    if (!branchExists) throw new BadRequestException('branch_id does not exist');

    const productExists = await this.prisma.products.findUnique({ where: { id: dto.product_id } });
    if (!productExists) throw new BadRequestException('product_id does not exist');

    const existing = await this.prisma.inventory.findUnique({
      where: { branch_id_product_id: { branch_id: dto.branch_id, product_id: dto.product_id } },
    });
    if (existing) throw new BadRequestException('Inventory record for this branch and product already exists');

    return this.prisma.inventory.create({
      data: {
        branch_id: dto.branch_id,
        product_id: dto.product_id,
        current_stock: dto.current_stock ?? 0,
        min_stock: dto.min_stock ?? 0,
        max_stock: dto.max_stock,
        unit_measure: dto.unit_measure ?? 'units',
        last_restock_at: dto.last_restock_at ? new Date(dto.last_restock_at) : undefined,
      },
    });
  }

  async update(id: string, dto: UpdateInventoryDto) {
    await this.ensureExists(id);

    if (dto.branch_id) {
      const branchExists = await this.prisma.branches.findUnique({ where: { id: dto.branch_id } });
      if (!branchExists) throw new BadRequestException('branch_id does not exist');
    }

    if (dto.product_id) {
      const productExists = await this.prisma.products.findUnique({ where: { id: dto.product_id } });
      if (!productExists) throw new BadRequestException('product_id does not exist');
    }

    return this.prisma.inventory.update({
      where: { id },
      data: {
        ...(dto.branch_id ? { branch_id: dto.branch_id } : {}),
        ...(dto.product_id ? { product_id: dto.product_id } : {}),
        ...(dto.current_stock !== undefined ? { current_stock: dto.current_stock } : {}),
        ...(dto.min_stock !== undefined ? { min_stock: dto.min_stock } : {}),
        ...(dto.max_stock !== undefined ? { max_stock: dto.max_stock } : {}),
        ...(dto.unit_measure ? { unit_measure: dto.unit_measure } : {}),
        ...(dto.last_restock_at ? { last_restock_at: new Date(dto.last_restock_at) } : {}),
      },
    });
  }
}
