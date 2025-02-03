import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CatalogueEntity } from '@common/entities';
import { CommonRepositoryEnum } from '@shared/enums';
import { CreateCatalogueDto } from '@common/dto';

@Injectable()
export class CatalogueService {
  constructor(@Inject(CommonRepositoryEnum.CATALOGUE_REPOSITORY) private repository: Repository<CatalogueEntity>) {
  }

  async create(payload: CatalogueEntity | CreateCatalogueDto): Promise<CatalogueEntity> {
    const entity = this.repository.create(payload);

    return await this.repository.save(entity);
  }

  async findAll(): Promise<CatalogueEntity[]> {
    const relations = {};
    const where = {};

    return await this.repository.find({ relations, where, order: { sort: 'desc' } });
  }

  async findOne(id: string): Promise<CatalogueEntity> {
    const relations = {};
    const where = { id };

    const entity = await this.repository.findOne({ relations, where });

    if (!entity) throw new NotFoundException('El registro no existe');

    return entity;
  }

  async update(id: string, payload: CatalogueEntity): Promise<any> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) throw new NotFoundException('El registro no existe');

    return await this.repository.update(id, payload);
  }

  async remove(id: string): Promise<CatalogueEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) throw new NotFoundException('El registro no existe');

    return await this.repository.softRemove(entity);
  }
  async findCataloguesByType(type: string): Promise<CatalogueEntity[]> {
    const where = {type};
    return await this.repository.find({ where, order: { sort: 'asc' } });
  }

}
