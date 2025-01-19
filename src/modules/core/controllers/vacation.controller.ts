import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseHttpModel } from '@shared/models';
import { VacationService } from '../services/vacation.service';

@ApiTags('Vacation')
@Controller('vacations')
export class VacationController {
  constructor(private readonly vacationService: VacationService) {}

  @ApiOperation({ summary: 'Create Vacation' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.vacationService.create(payload);

    return {
      data: serviceResponse,
      message: 'Vacation created successfully',
      title: 'Created',
    };
  }

  @ApiOperation({ summary: 'Find All Vacations' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.vacationService.findAll();

    return {
      data: serviceResponse,
      message: 'All vacations retrieved',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Find One Vacation' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.vacationService.findOne(id);

    return {
      data: serviceResponse,
      message: 'Vacation retrieved',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Update Vacation' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.vacationService.update(id, payload);

    return {
      data: serviceResponse,
      message: 'Vacation updated successfully',
      title: 'Updated',
    };
  }

  @ApiOperation({ summary: 'Delete Vacation' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.vacationService.delete(id);

    return {
      data: serviceResponse,
      message: 'Vacation deleted successfully',
      title: 'Deleted',
    };
  }
}
