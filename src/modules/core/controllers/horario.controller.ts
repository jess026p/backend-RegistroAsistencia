import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseHttpModel } from '@shared/models';
import { HorarioService } from '../services/horario.service';
import { CreateHorarioDto, UpdateHorarioDto } from '../dto/horario.dto';

@ApiTags('Horarios')
@Controller('horarios')
export class HorarioController {
  constructor(private readonly horarioService: HorarioService) {}

  @ApiOperation({ summary: 'Create Horario' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CreateHorarioDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.horarioService.create(payload);

    return {
      data: serviceResponse,
      message: 'Horario creado',
      title: 'Created',
    };
  }

  @ApiOperation({ summary: 'Find All Horarios' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.horarioService.findAll();

    return {
      data: serviceResponse,
      message: 'Todos los horarios',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Find One Horario' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.horarioService.findOne(id);

    return {
      data: serviceResponse,
      message: 'Horario encontrado',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Update Horario' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateHorarioDto,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.horarioService.update(id, payload);

    return {
      data: serviceResponse,
      message: 'Horario actualizado',
      title: 'Updated',
    };
  }

  @ApiOperation({ summary: 'Delete Horario' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.horarioService.delete(id);

    return {
      data: serviceResponse,
      message: 'Horario eliminado',
      title: 'Deleted',
    };
  }

  @ApiOperation({ summary: 'Obtener ubicaciones asignadas al usuario' })
  @Get('user/:userId/locations')
  @HttpCode(HttpStatus.OK)
  async findLocationsByUserId(@Param('userId', ParseUUIDPipe) userId: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.horarioService.findLocationByUserId(userId);

    return {
      data: serviceResponse,
      message: 'Ubicaciones encontradas',
      title: 'Success',
    };
  }
} 