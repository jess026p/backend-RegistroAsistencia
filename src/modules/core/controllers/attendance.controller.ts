import { Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseHttpModel } from '@shared/models';
import { AttendanceService } from '../services/attendance.service';

@ApiTags('Attendance')
@Controller('attendances')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @ApiOperation({ summary: 'Create Attendance' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.attendanceService.create(payload);

    return {
      data: serviceResponse,
      message: 'Attendance created successfully',
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
      message: 'Attendance updated successfully',
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
      message: 'Attendance deleted successfully',
      title: 'Deleted',
    };
  }
}
