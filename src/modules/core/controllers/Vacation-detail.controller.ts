import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseHttpModel } from '@shared/models';
import { VacationDetailService } from '../services/vacation-detail.service';

@ApiTags('VacationDetail')
@Controller('vacation-details')
export class VacationDetailController {
  constructor(private readonly vacationDetailService: VacationDetailService) {}

  @ApiOperation({ summary: 'Create Vacation Detail' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.vacationDetailService.create(payload);

    return {
      data: serviceResponse,
      message: 'Vacation detail created successfully',
      title: 'Created',
    };
  }

  @ApiOperation({ summary: 'Find All Vacation Details' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.vacationDetailService.findAll();

    return {
      data: serviceResponse,
      message: 'All vacation details retrieved',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Find One Vacation Detail' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.vacationDetailService.findOne(id);

    return {
      data: serviceResponse,
      message: 'Vacation detail retrieved',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Update Vacation Detail' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.vacationDetailService.update(id, payload);

    return {
      data: serviceResponse,
      message: 'Vacation detail updated successfully',
      title: 'Updated',
    };
  }

  @ApiOperation({ summary: 'Delete Vacation Detail' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.vacationDetailService.delete(id);

    return {
      data: serviceResponse,
      message: 'Vacation detail deleted successfully',
      title: 'Deleted',
    };
  }
}
