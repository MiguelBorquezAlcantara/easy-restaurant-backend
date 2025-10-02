
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TablesService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureExists(id: string) {
    const table = await this.prisma.tables.findUnique({ where: { id } });
    if (!table) throw new NotFoundException(`Table with id ${id} not found`);
    return table;
  }

  async findAll() {
    return this.prisma.tables.findMany();
  }

  async findById(id: string) {
    return this.ensureExists(id);
  }

  async findByBranch(branchId: string) {
    const branchExists = await this.prisma.branches.findUnique({ where: { id: branchId } });
    if (!branchExists) throw new NotFoundException(`Branch with id ${branchId} not found`);

    const tables = await this.prisma.tables.findMany({ where: { branch_id: branchId } });
    if (!tables.length) throw new NotFoundException(`No tables found for branch id ${branchId}`);
    return tables;
  }

  async delete(id: string) {
    await this.ensureExists(id);
    return this.prisma.tables.delete({ where: { id } });
  }

  async create(dto: CreateTableDto) {
    const branchExists = await this.prisma.branches.findUnique({ where: { id: dto.branch_id } });
    if (!branchExists) throw new BadRequestException('branch_id does not exist');

    // Verificar unicidad branch_id + number
    const existing = await this.prisma.tables.findUnique({
      where: { branch_id_number: { branch_id: dto.branch_id, number: dto.number } },
    });
    if (existing) throw new BadRequestException('Table number already exists for this branch');

    return this.prisma.tables.create({
      data: {
        branch_id: dto.branch_id,
        number: dto.number,
        name: dto.name,
        capacity: dto.capacity ?? 4,
        zone: dto.zone,
        status: dto.status ?? 'available',
        qr_code: dto.qr_code,
        is_active: dto.is_active ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateTableDto) {
    await this.ensureExists(id);

    if (dto.branch_id) {
      const branchExists = await this.prisma.branches.findUnique({ where: { id: dto.branch_id } });
      if (!branchExists) throw new BadRequestException('branch_id does not exist');
    }

    return this.prisma.tables.update({
      where: { id },
      data: {
        ...(dto.branch_id ? { branch_id: dto.branch_id } : {}),
        ...(dto.number ? { number: dto.number } : {}),
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.capacity !== undefined ? { capacity: dto.capacity } : {}),
        ...(dto.zone ? { zone: dto.zone } : {}),
        ...(dto.status ? { status: dto.status } : {}),
        ...(dto.qr_code ? { qr_code: dto.qr_code } : {}),
        ...(dto.is_active !== undefined ? { is_active: dto.is_active } : {}),
      },
    });
  }
}
