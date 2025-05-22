import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
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


  @Get('resumen/:userId')
  async getResumenAsistenciaUsuario(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query('mes') mes?: string,
    @Query('anio') anio?: string
  ) {
    const data = await this.asistenciaService.getResumenAsistenciaUsuario(userId, mes, anio);
    return { success: true, data };
  }

  @Get('historial/:userId')
  async getHistorialAsistenciaUsuario(@Param('userId', ParseUUIDPipe) userId: string) {
    const data = await this.asistenciaService.getHistorialAsistenciaUsuario(userId);
    return { success: true, data };
  }
} 