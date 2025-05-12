import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatalogueEntity } from '@common/entities';
import { CommonRepositoryEnum } from '../enums/common-repository.enum';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(CatalogueEntity)
    private readonly catalogueRepository: Repository<CatalogueEntity>,
  ) {}

  async findCatalogueById(id: string): Promise<CatalogueEntity> {
    return this.catalogueRepository.findOneBy({ id });
  }
} 