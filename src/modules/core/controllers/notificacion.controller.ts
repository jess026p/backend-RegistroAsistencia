import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { NotificacionService } from '../services/notificacion.service';

@Controller('notificaciones')
export class NotificacionController {
  constructor(private readonly notificacionService: NotificacionService) {}

  @Get('user/:userId')
  async getNotificacionesByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    const data = await this.notificacionService.findByUser(userId);
    return data;
  }
} 