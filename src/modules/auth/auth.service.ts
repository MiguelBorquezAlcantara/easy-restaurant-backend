import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { users } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ✅ Registrar un usuario
  async register(data: RegisterDto) {
    const { password, restaurant_code, ...rest } = data;

    // Buscar restaurante por code
    const restaurant = await this.prisma.restaurants.findUnique({
      where: { code: restaurant_code },
    });

    if (!restaurant) {
      throw new UnauthorizedException('Restaurant not found');
    }

    // Encriptar contraseña
    const password_hash = await bcrypt.hash(password, 10);

    const user = await this.prisma.users.create({
      data: {
        ...rest,
        password_hash,
        restaurant_id: restaurant.id,
      },
    });

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    };
  }

  
async validateUser(restaurant_code: string, employee_code: string, password: string): Promise<users | null> {
    const restaurant = await this.prisma.restaurants.findUnique({
      where: { code: restaurant_code },
    });
  
    if (!restaurant) return null;
  
    const user = await this.prisma.users.findFirst({
      where: { restaurant_id: restaurant.id, employee_code },
    });
  
    if (!user) return null;
  
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) return null;
  
    return user;
  }
  
  async login(user: users) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role_id,
      restaurant_id: user.restaurant_id,
    };
  
    return {
      access_token: await this.jwtService.signAsync(payload, { expiresIn: '1h' }),
    };
  }
  
}
