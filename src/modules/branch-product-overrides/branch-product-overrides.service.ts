
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBranchProductOverrideDto } from './dto/create-branch-product-override.dto';
import { UpdateBranchProductOverrideDto } from './dto/update-branch-product-override.dto';

@Injectable()
export class BranchProductOverridesService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureExists(id: string) {
    const override = await this.prisma.branch_product_overrides.findUnique({
      where: { id },
    });
    if (!override) throw new NotFoundException(`Branch product override with id ${id} not found`);
    return override;
  }

  async findAll() {
    return this.prisma.branch_product_overrides.findMany();
  }

  async findById(id: string) {
    return this.ensureExists(id);
  }

  async findByBranch(branchId: string) {
    const branchExists = await this.prisma.branches.findUnique({ where: { id: branchId } });
    if (!branchExists) throw new NotFoundException(`Branch with id ${branchId} not found`);

    const overrides = await this.prisma.branch_product_overrides.findMany({ where: { branch_id: branchId } });
    if (!overrides.length) throw new NotFoundException(`No overrides found for branch id ${branchId}`);
    return overrides;
  }

  async delete(id: string) {
    await this.ensureExists(id);
    return this.prisma.branch_product_overrides.delete({ where: { id } });
  }

  async create(dto: CreateBranchProductOverrideDto) {
    const branchExists = await this.prisma.branches.findUnique({ where: { id: dto.branch_id } });
    if (!branchExists) throw new BadRequestException('branch_id does not exist');

    const productExists = await this.prisma.products.findUnique({ where: { id: dto.product_id } });
    if (!productExists) throw new BadRequestException('product_id does not exist');

    // Verificar unicidad branch_id + product_id
    const existing = await this.prisma.branch_product_overrides.findUnique({
      where: { branch_id_product_id: { branch_id: dto.branch_id, product_id: dto.product_id } },
    });
    if (existing) throw new BadRequestException('Override for this branch and product already exists');

    return this.prisma.branch_product_overrides.create({
      data: {
        branch_id: dto.branch_id,
        product_id: dto.product_id,
        custom_name: dto.custom_name,
        custom_price: dto.custom_price,
        custom_cost: dto.custom_cost,
        is_available: dto.is_available ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateBranchProductOverrideDto) {
    await this.ensureExists(id);

    if (dto.branch_id) {
      const branchExists = await this.prisma.branches.findUnique({ where: { id: dto.branch_id } });
      if (!branchExists) throw new BadRequestException('branch_id does not exist');
    }

    if (dto.product_id) {
      const productExists = await this.prisma.products.findUnique({ where: { id: dto.product_id } });
      if (!productExists) throw new BadRequestException('product_id does not exist');
    }

    return this.prisma.branch_product_overrides.update({
      where: { id },
      data: {
        ...(dto.branch_id ? { branch_id: dto.branch_id } : {}),
        ...(dto.product_id ? { product_id: dto.product_id } : {}),
        ...(dto.custom_name ? { custom_name: dto.custom_name } : {}),
        ...(dto.custom_price !== undefined ? { custom_price: dto.custom_price } : {}),
        ...(dto.custom_cost !== undefined ? { custom_cost: dto.custom_cost } : {}),
        ...(dto.is_available !== undefined ? { is_available: dto.is_available } : {}),
      },
    });
  }
}
