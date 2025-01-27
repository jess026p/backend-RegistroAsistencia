import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseHttpModel } from '@shared/models';
import { ScheduleService } from '../services/schedule.service';

@ApiTags('Schedule')
@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {
  }

  @ApiOperation({ summary: 'Create Schedule' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.scheduleService.create(payload);

    return {
      data: serviceResponse,
      message: 'Schedule created successfully',
      title: 'Created',
    };
  }

  @ApiOperation({ summary: 'Find All Schedules' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.scheduleService.findAll();

    return {
      data: serviceResponse,
      message: 'All schedules retrieved',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Find One Schedule' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.scheduleService.findOne(id);

    return {
      data: serviceResponse,
      message: 'Schedule retrieved',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Update Schedule' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.scheduleService.update(id, payload);

    return {
      data: serviceResponse,
      message: 'Schedule updated successfully',
      title: 'Updated',
    };
  }

  @ApiOperation({ summary: 'Delete Schedule' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.scheduleService.delete(id);

    return {
      data: serviceResponse,
      message: 'Schedule deleted successfully',
      title: 'Deleted',
    };
  }
}
