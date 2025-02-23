import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseHttpModel } from '@shared/models';
import { AttendanceService } from '../services/attendance.service';
import { Auth, PublicRoute } from '@auth/decorators';

@ApiTags('Attendance')
@Controller('attendances')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {
  }

  @ApiOperation({ summary: 'Obtener asistencias por nombre de empleado' })
  @Get('filters')
  @HttpCode(HttpStatus.OK)
  async findAttendancesByEmployeeName(
    @Query('search') employeeName: string,
    @Query('startedAt') startedAt: Date,
    @Query('endedAt') endedAt: Date,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.attendanceService.findAttendancesByEmployeeName(employeeName, startedAt, endedAt);
    return {
      data: serviceResponse,
      message: 'Attendance retrieved',
      title: 'Success',
    };
  }



  @ApiOperation({ summary: 'Create Attendance' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.attendanceService.create(payload);
    return {
      data: serviceResponse,
      message: 'Asistencia Creada',
      title: 'Created',
    };
  }

  @ApiOperation({ summary: 'Find All Attendances' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.attendanceService.findAll();

    return {
      data: serviceResponse,
      message: 'All attendances retrieved',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Find One Attendance' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.attendanceService.findOne(id);

    return {
      data: serviceResponse,
      message: 'Attendance retrieved',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Update Attendance' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.attendanceService.update(id, payload);

    return {
      data: serviceResponse,
      message: 'Asistencia Modificada',
      title: 'Updated',
    };
  }

  @ApiOperation({ summary: 'Delete Attendance' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.attendanceService.delete(id);

    return {
      data: serviceResponse,
      message: 'Asistencia eliminada',
      title: 'Deleted',
    };
  }

  @ApiOperation({ summary: 'Find One Attendance' })
  @Post(':employeeId/register')
  @HttpCode(HttpStatus.OK)
  async register(@Param('employeeId', ParseUUIDPipe) employeeId: string,
                 @Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.attendanceService.register(employeeId, payload);
    return {
      data: serviceResponse,
      message: 'Attendance retrieved',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: '' })
  @Get(':employeeId/current')
  @HttpCode(HttpStatus.OK)
  async findAttendancesByEmployee(@Param('employeeId', ParseUUIDPipe) employeeId: string,
                                  @Query('startedAt') startedAt: Date,
                                  @Query('endedAt') endedAt: Date,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.attendanceService.findAttendancesByEmployee(employeeId, startedAt, endedAt);
    return {
      data: serviceResponse,
      message: 'Attendance retrieved',
      title: 'Success',
    };
  }



}

