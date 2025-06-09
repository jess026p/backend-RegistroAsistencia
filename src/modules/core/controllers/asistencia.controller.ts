import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { AsistenciaService } from '../services/asistencia.service';
import { CreateAsistenciaDto, ResumenAsistenciaDto } from '../dto/asistencia.dto';
import { getDireccionReverseGeocoding } from '../services/asistencia.service';

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
  async getResumenAsistencia(
    @Param('userId') userId: string,
    @Query('mes') mes?: number,
    @Query('anio') anio?: number,
  ) {
    const data = await this.asistenciaService.getResumenAsistenciaUsuario(userId, mes?.toString(), anio?.toString());
    return { data };
  }

  @Get('historial/:userId')
  async getHistorialAsistenciaUsuario(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query('mes') mes?: string,
    @Query('anio') anio?: string,
  ) {
    const data = await this.asistenciaService.getHistorialAsistenciaUsuario(userId, mes, anio);
    return { data };
  }

  @Get('user/:userId/fecha/:fecha')
  async getAsistenciaByUserAndDate(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('fecha') fecha: string
  ) {
    const data = await this.asistenciaService.findByUserAndDate(userId, fecha);
    return { success: true, data };
  }
} 