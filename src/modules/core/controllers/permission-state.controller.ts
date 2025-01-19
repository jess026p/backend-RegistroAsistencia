import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseHttpModel } from '@shared/models';
import { PermissionStateService } from '../services/permission-state.service';

@ApiTags('PermissionState')
@Controller('permission-states')
export class PermissionStateController {
  constructor(private readonly permissionStateService: PermissionStateService) {}

  @ApiOperation({ summary: 'Create Permission State' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.permissionStateService.create(payload);

    return {
      data: serviceResponse,
      message: 'Permission state created successfully',
      title: 'Created',
    };
  }

  @ApiOperation({ summary: 'Find All Permission States' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.permissionStateService.findAll();

    return {
      data: serviceResponse,
      message: 'All permission states retrieved',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Find One Permission State' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.permissionStateService.findOne(id);

    return {
      data: serviceResponse,
      message: 'Permission state retrieved',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Update Permission State' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.permissionStateService.update(id, payload);

    return {
      data: serviceResponse,
      message: 'Permission state updated successfully',
      title: 'Updated',
    };
  }

  @ApiOperation({ summary: 'Delete Permission State' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.permissionStateService.delete(id);

    return {
      data: serviceResponse,
      message: 'Permission state deleted successfully',
      title: 'Deleted',
    };
  }
}
