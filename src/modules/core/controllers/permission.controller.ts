import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseHttpModel } from '@shared/models';
import { PermissionService } from '../services/permission.service';

@ApiTags('Permission')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiOperation({ summary: 'Create Permission' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.permissionService.create(payload);

    return {
      data: serviceResponse,
      message: 'Permission created successfully',
      title: 'Created',
    };
  }

  @ApiOperation({ summary: 'Find All Permissions' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.permissionService.findAll();

    return {
      data: serviceResponse,
      message: 'All permissions retrieved',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Find One Permission' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.permissionService.findOne(id);

    return {
      data: serviceResponse,
      message: 'Permission retrieved',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Update Permission' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.permissionService.update(id, payload);

    return {
      data: serviceResponse,
      message: 'Permission updated successfully',
      title: 'Updated',
    };
  }

  @ApiOperation({ summary: 'Delete Permission' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.permissionService.delete(id);

    return {
      data: serviceResponse,
      message: 'Permission deleted successfully',
      title: 'Deleted',
    };
  }
}
