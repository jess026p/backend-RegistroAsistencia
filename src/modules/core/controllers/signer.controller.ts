import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseHttpModel } from '@shared/models';
import { SignerService } from '../services/signer.service';

@ApiTags('Signer')
@Controller('signers')
export class SignerController {
  constructor(private readonly signerService: SignerService) {}

  @ApiOperation({ summary: 'Create Signer' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.signerService.create(payload);

    return {
      data: serviceResponse,
      message: 'Signer created successfully',
      title: 'Created',
    };
  }

  @ApiOperation({ summary: 'Find All Signers' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.signerService.findAll();

    return {
      data: serviceResponse,
      message: 'All signers retrieved',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Find One Signer' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.signerService.findOne(id);

    return {
      data: serviceResponse,
      message: 'Signer retrieved',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Update Signer' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.signerService.update(id, payload);

    return {
      data: serviceResponse,
      message: 'Signer updated successfully',
      title: 'Updated',
    };
  }

  @ApiOperation({ summary: 'Delete Signer' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.signerService.delete(id);

    return {
      data: serviceResponse,
      message: 'Signer deleted successfully',
      title: 'Deleted',
    };
  }
}
