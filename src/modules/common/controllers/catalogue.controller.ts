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
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseHttpModel } from '@shared/models';
import { CatalogueService } from '../services/catalogue.service';
import { CatalogueEntity } from '@common/entities';
import { PublicRoute } from '@auth/decorators';

@ApiTags('Catalogue')
@Controller('catalogues')
export class CatalogueController {
  constructor(private readonly catalogueService: CatalogueService) {
  }

  @ApiOperation({ summary: 'Create' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CatalogueEntity): Promise<ResponseHttpModel> {
    const serviceResponse = await this.catalogueService.create(payload);

    return {
      data: serviceResponse,
      message: 'Registro creado correctamente',
      title: 'Creado',
    };
  }

  @PublicRoute()
  @ApiOperation({ summary: 'Find All' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.catalogueService.findAll();

    return {
      data: serviceResponse,
      message: `Find All`,
      title: `Success`,
    };
  }

  @ApiOperation({ summary: 'Find One' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.catalogueService.findOne(id);

    return {
      data: serviceResponse,
      message: `Find One`,
      title: `Success`,
    };
  }

  @ApiOperation({ summary: 'Update' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: CatalogueEntity): Promise<ResponseHttpModel> {
    const serviceResponse = await this.catalogueService.update(id, payload);

    return {
      data: serviceResponse,
      message: `Registro actualizado correctamente`,
      title: `Actualizado`,
    };
  }

  @ApiOperation({ summary: 'Delete' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.catalogueService.remove(id);

    return {
      data: serviceResponse,
      message: `Registro eliminado correctamente`,
      title: `Eliminado`,
    };
  }


  @ApiOperation({ summary: 'Find One' })
  @PublicRoute()
  @Get('types/:type')
  @HttpCode(HttpStatus.OK)
  async findCataloguesByType(@Param('type') type: string): Promise<ResponseHttpModel> {
    console.log('Type')
    const serviceResponse = await this.catalogueService.findCataloguesByType(type);
    return {
      data: serviceResponse,
      message: `Find One`,
      title: `Success`,
    };
  }

}
