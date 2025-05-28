import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { NotificacionEntity } from '../entities/notificacion.entity';
import { CoreRepositoryEnum } from 'src/shared/enums/core-repository.enum';

@Injectable()
export class NotificacionService {
  constructor(
    @Inject(CoreRepositoryEnum.NOTIFICACION_REPOSITORY)
    private readonly repository: Repository<NotificacionEntity>,
  ) {}

  async findByUser(userId: string): Promise<any[]> {
    const notificaciones = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return notificaciones.map(n => ({
      fecha: n.createdAt.toISOString().replace('T', ' ').slice(0, 16),
      mensaje: n.mensaje,
    }));
  }
} 