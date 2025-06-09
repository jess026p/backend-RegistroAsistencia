import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from '@config';
import { ConfigType } from '@nestjs/config';
import { PayloadTokenModel } from '@auth/models';
import { UserEntity } from '@auth/entities';
import { UsersService } from '../services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userService: UsersService,
    @Inject(config.KEY) configService: ConfigType<typeof config>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(payload: PayloadTokenModel): Promise<UserEntity> {
    console.log('[JWT STRATEGY] Payload recibido:', payload);
    const user = await this.userService.findOne(payload.id);
    console.log('[JWT STRATEGY] Usuario encontrado:', user);

    if (!user) {
      console.log('[JWT STRATEGY] Usuario no existe. Lanzando UnauthorizedException.');
      throw new UnauthorizedException('El Usuario no existe.');
    }

    if (user.suspendedAt) {
      console.log('[JWT STRATEGY] Usuario suspendido. Lanzando UnauthorizedException.');
      throw new UnauthorizedException('El usuario está suspendido.');
    }

    if (user.maxAttempts === 0) {
      console.log('[JWT STRATEGY] Usuario bloqueado por intentos. Lanzando UnauthorizedException.');
      throw new UnauthorizedException('Ha excedido el número máximo de intentos permitidos');
    }

    return user;
  }
}
