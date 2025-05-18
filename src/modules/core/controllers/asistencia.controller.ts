import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { AsistenciaService } from '../services/asistencia.service';
import { CreateAsistenciaDto } from '../dto/asistencia.dto';

@Controller('asistencias')
export class AsistenciaController {
  constructor(private readonly asistenciaService: AsistenciaService) {}

  @Post('marcar')
  @HttpCode(HttpStatus.CREATED)
  async marcarAsistencia(@Body() payload: CreateAsistenciaDto) {
    const data = await this.asistenciaService.marcarAsistencia(payload);
    return { success: true, data, message: 'Asistencia registrada correctamente' };
  }

  @Get('user/:userId')
  async obtenerAsistenciasPorUsuario(@Param('userId', ParseUUIDPipe) userId: string) {
    const data = await this.asistenciaService.obtenerAsistenciasPorUsuario(userId);
    return { success: true, data };
  }

  @Get('user/:userId/fecha/:fecha')
  async obtenerAsistenciasPorUsuarioYFecha(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('fecha') fecha: string,
  ) {
    const data = await this.asistenciaService.obtenerAsistenciasPorUsuarioYFecha(userId, fecha);
    return { success: true, data };
  }
} 