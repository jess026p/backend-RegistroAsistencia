// src/modules/core/controllers/site.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put, ParseUUIDPipe } from '@nestjs/common';
import { SiteService } from '../services/site.service';
import { CreateSiteDto, UpdateSiteDto } from '../dto/site.dto';
import { SiteEntity } from '../entities/site.entity';

@Controller('sites')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Post()
  create(@Body() createSiteDto: CreateSiteDto): Promise<SiteEntity> {
    return this.siteService.create(createSiteDto);
  }

  @Get()
  findAll(): Promise<SiteEntity[]> {
    return this.siteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<SiteEntity> {
    return this.siteService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSiteDto: UpdateSiteDto,
  ): Promise<SiteEntity> {
    return this.siteService.update(id, updateSiteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.siteService.remove(id);
  }
}