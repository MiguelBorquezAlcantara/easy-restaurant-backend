import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret123',
    });
  }

  validate(payload: { sub: string; email?: string; role?: string; restaurant_id?: string }) {
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      restaurantId: payload.restaurant_id,
    };
  }
}
