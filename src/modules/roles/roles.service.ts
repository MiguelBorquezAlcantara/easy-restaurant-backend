import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureExists(id: string) {
    const role = await this.prisma.roles.findUnique({ where: { id } });
    if (!role) throw new NotFoundException(`Role with id ${id} not found`);
    return role;
  }

  async findAll() {
    return this.prisma.roles.findMany();
  }

  async findById(id: string) {
    return this.ensureExists(id);
  }

  async create(dto: CreateRoleDto) {
    return this.prisma.roles.create({
      data: {
        name: dto.name,
        display_name: dto.display_name,
        description: dto.description,
        is_system: dto.is_system ?? false,
      },
    });
  }

  async update(id: string, dto: UpdateRoleDto) {
    await this.ensureExists(id);
    return this.prisma.roles.update({
      where: { id },
      data: {
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.display_name ? { display_name: dto.display_name } : {}),
        ...(dto.description ? { description: dto.description } : {}),
        ...(dto.is_system !== undefined ? { is_system: dto.is_system } : {}),
      },
    });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    return this.prisma.roles.delete({ where: { id } });
  }
}
