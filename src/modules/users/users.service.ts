import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureExists(id: string) {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findAll() {
    return this.prisma.users.findMany({
      include: { restaurant: true, role: true },
    });
  }

  async findById(id: string) {
    return this.ensureExists(id);
  }

  async create(dto: CreateUserDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.users.create({
      data: {
        restaurant_id: dto.restaurant_id,
        role_id: dto.role_id,
        email: dto.email,
        password_hash: hashedPassword,
        first_name: dto.first_name,
        last_name: dto.last_name,
        phone: dto.phone,
        employee_code: dto.employee_code,
        pin_code: dto.pin_code,
        is_active: dto.is_active ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    const { password, ...rest } = dto;
  
    const data: typeof rest & { password_hash?: string } = { ...rest };
  
    if (password) {
      data.password_hash = await bcrypt.hash(password, 10);
    }
  
    return this.prisma.users.update({
      where: { id },
      data,
    });
  }  

  async delete(id: string) {
    await this.ensureExists(id);
    return this.prisma.users.delete({
      where: { id },
    });
  }
}
