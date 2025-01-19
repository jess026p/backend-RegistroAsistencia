import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseHttpModel } from '@shared/models';
import { FormService } from '../services/form.service';

@ApiTags('Form')
@Controller('forms')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @ApiOperation({ summary: 'Create Form' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.formService.create(payload);

    return {
      data: serviceResponse,
      message: 'Form created successfully',
      title: 'Created',
    };
  }

  @ApiOperation({ summary: 'Find All Forms' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.formService.findAll();

    return {
      data: serviceResponse,
      message: 'All forms retrieved',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Find One Form' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.formService.findOne(id);

    return {
      data: serviceResponse,
      message: 'Form retrieved',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Update Form' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.formService.update(id, payload);

    return {
      data: serviceResponse,
      message: 'Form updated successfully',
      title: 'Updated',
    };
  }

  @ApiOperation({ summary: 'Delete Form' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.formService.delete(id);

    return {
      data: serviceResponse,
      message: 'Form deleted successfully',
      title: 'Deleted',
    };
  }
}
