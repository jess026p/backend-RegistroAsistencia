import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe, Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseHttpModel } from '@shared/models';
import { EmployeeService } from '../services/employee.service';

@ApiTags('Attendance')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {
  }

  @ApiOperation({ summary: 'Create Attendance' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.employeeService.create(payload);

    return {
      data: serviceResponse,
      message: 'Empleado creado',
      title: 'Creado',
    };
  }

  @ApiOperation({ summary: 'Find All Attendances' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.employeeService.findAll();

    return {
      data: serviceResponse,
      message: 'All attendances retrieved',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Find One Attendance' })
  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('userId', ParseUUIDPipe) userId: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.employeeService.findOne(userId);

    return {
      data: serviceResponse,
      message: 'Attendance retrieved',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Update Attendance' })
  @Put(':userId')
  @HttpCode(HttpStatus.CREATED)
  async update(@Param('userId', ParseUUIDPipe) userId: string, @Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.employeeService.update(userId, payload);

    return {
      data: serviceResponse,
      message: 'Empleado Editado',
      title: 'Updated',
    };
  }

  @ApiOperation({ summary: 'disable Attendance' })
  @Patch(':id/disable')
  @HttpCode(HttpStatus.CREATED)
  async disable(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.employeeService.disable(id);

    return {
      data: serviceResponse,
      message: 'Empleado Deshabilitado',
      title: 'disable',
    };
  }

  @ApiOperation({ summary: 'disable Attendance' })
  @Patch(':id/enable')
  @HttpCode(HttpStatus.CREATED)
  async enable(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.employeeService.enable(id);

    return {
      data: serviceResponse,
      message: 'Empleado Habilitado',
      title: 'Enable',
    };
  }


  @ApiOperation({ summary: 'Delete Attendance' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.employeeService.delete(id);

    return {
      data: serviceResponse,
      message: 'Empleado Eliminado',
      title: 'Deleted',
    };
  }

  @ApiOperation({ summary: 'Update Attendance' })
  @Patch(':id/assign-schedules')
  @HttpCode(HttpStatus.CREATED)
  async assignSchedule(@Param('id', ParseUUIDPipe) id: string, @Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.employeeService.assignSchedule(id, payload);

    return {
      data: serviceResponse,
      message: 'Horario Asignado',
      title: 'Updated',
    };
  }
}
