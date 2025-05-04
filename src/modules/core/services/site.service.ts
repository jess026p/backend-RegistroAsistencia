// src/modules/core/services/site.service.ts
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SiteEntity } from '../entities/site.entity';
import { CreateSiteDto, UpdateSiteDto } from '../dto/site.dto';
import { CoreRepositoryEnum } from '@shared/enums';

@Injectable()
export class SiteService {
  constructor(
    @Inject(CoreRepositoryEnum.SITE_REPOSITORY)
    private readonly siteRepository: Repository<SiteEntity>,
  ) {}

  async create(createSiteDto: CreateSiteDto): Promise<SiteEntity> {
    const site = this.siteRepository.create({
      name: createSiteDto.name,
      latitude: createSiteDto.latitude,
      longitude: createSiteDto.longitude,
      radius: createSiteDto.radius,
      employeeId: createSiteDto.employeeId,
    });
    return await this.siteRepository.save(site);
  }

  async findAll(): Promise<SiteEntity[]> {
    return await this.siteRepository.find({
      relations: ['employee'],
    });
  }

  async findOne(id: string): Promise<SiteEntity> {
    const site = await this.siteRepository.findOne({
      where: { id },
      relations: ['employee'],
    });

    if (!site) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }

    return site;
  }

  async update(id: string, updateSiteDto: UpdateSiteDto): Promise<SiteEntity> {
    const site = await this.findOne(id);
    
    this.siteRepository.merge(site, {
      name: updateSiteDto.name,
      latitude: updateSiteDto.latitude,
      longitude: updateSiteDto.longitude,
      radius: updateSiteDto.radius,
      employeeId: updateSiteDto.employeeId,
    });

    return await this.siteRepository.save(site);
  }

  async remove(id: string): Promise<void> {
    const site = await this.findOne(id);
    await this.siteRepository.remove(site);
  }
}