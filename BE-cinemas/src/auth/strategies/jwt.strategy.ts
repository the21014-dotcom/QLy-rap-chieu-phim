import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'YOUR_SECRET_KEY', // Đảm bảo trùng với secret trong AuthModule
    });
  }

 async validate(payload: any) {
  // Trả về object có cả 'id' (cho controller) và 'role' (cho guard)
  return { 
    id: payload.sub, 
    userId: payload.sub, // Dự phòng
    username: payload.username, 
    role: payload.role  // Đảm bảo payload.role là một object { name: 'ADMIN' } hoặc tương đương
  };
}
}
