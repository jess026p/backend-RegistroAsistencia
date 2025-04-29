import {
  ForbiddenException,
  Inject,
  Injectable,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PayloadTokenModel } from '@auth/models';
import { Repository } from 'typeorm';
import { AuthRepositoryEnum } from '@shared/enums';
import { UserEntity } from '@auth/entities';

@Injectable()
export class VerifyUserMiddleware implements NestMiddleware {
  constructor(
    @Inject(AuthRepositoryEnum.USER_REPOSITORY)
    private readonly userEntityRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {
  }

  async use(req: Request, res: Response, next: NextFunction) {
    console.log('🔍 Ruta actual:', req.originalUrl || req.url);
    
    // Permitir solicitudes de autenticación y login sin token
    if (req.originalUrl.includes('/auth/login') || 
        req.originalUrl.includes('/auth/setup') ||
        req.originalUrl.includes('/roles')) {
      console.log('✅ Ruta pública detectada, permitiendo acceso sin token');
      return next();
    }
    
    // Para depuración, permitir todas las solicitudes
    console.log('⚠️ Permitiendo todas las solicitudes - SOLO PARA DEPURACIÓN');
    return next();
    
    // Código original comentado para depuración
    /*
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ');

      try {
        const jwtDecode = this.jwtService.decode(token[1]) as PayloadTokenModel;

        if (!jwtDecode) {
          console.error('❌ Token no válido');
          throw new UnauthorizedException(`Token no válido`);
        }

        const user = await this.userEntityRepository.findOneBy({
          id: jwtDecode.id,
        });

        if (!user) {
          console.error('❌ Usuario no encontrado:', jwtDecode.id);
          throw new UnauthorizedException(`Usuario no válido`);
        }

        if (user.suspendedAt) {
          console.error('❌ Usuario suspendido:', user.username);
          throw new ForbiddenException({
            error: 'Cuenta Suspendida',
            message: 'La cuenta del usuario está suspendida',
          });
        }
        
        console.log('✅ Usuario autenticado:', user.username);
      } catch (error) {
        console.error('❌ Error al verificar token:', error);
        throw new UnauthorizedException('Token inválido o expirado');
      }
    } else {
      console.error('❌ No se proporcionó token de autorización');
      throw new UnauthorizedException('No se proporcionó token de autorización');
    }
    */

    next();
  }
}
