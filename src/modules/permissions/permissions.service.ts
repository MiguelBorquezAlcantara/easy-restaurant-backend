import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureExists(id: string) {
    const permission = await this.prisma.permissions.findUnique({ where: { id } });
    if (!permission) throw new NotFoundException(`Permission with id ${id} not found`);
    return permission;
  }

  async findAll() {
    return this.prisma.permissions.findMany();
  }

  async findById(id: string) {
    return this.ensureExists(id);
  }

  async create(dto: CreatePermissionDto) {
    // Validar que no exista combinación módulo+acción duplicada
    const exists = await this.prisma.permissions.findUnique({
      where: { module_action: { module: dto.module, action: dto.action } },
    });
    if (exists) throw new BadRequestException('Ya existe un permiso con ese módulo y acción');

    return this.prisma.permissions.create({
      data: {
        module: dto.module,
        action: dto.action,
        description: dto.description,
      },
    });
  }

  async update(id: string, dto: UpdatePermissionDto) {

    const existingPermission = await this.ensureExists(id);
    const module = dto.module ?? existingPermission.module;
    const action = dto.action ?? existingPermission.action;
  
    const exists = await this.prisma.permissions.findUnique({
      where: { module_action: { module, action } },
    });
    if (exists && exists.id !== id) {
      throw new BadRequestException('Ya existe un permiso con ese módulo y acción');
    }
  
    return this.prisma.permissions.update({
      where: { id },
      data: {
        ...(dto.module ? { module: dto.module } : {}),
        ...(dto.action ? { action: dto.action } : {}),
        ...(dto.description ? { description: dto.description } : {}),
      },
    });
  }

  async delete(id: string) {
    await this.ensureExists(id);
    return this.prisma.permissions.delete({ where: { id } });
  }
}
