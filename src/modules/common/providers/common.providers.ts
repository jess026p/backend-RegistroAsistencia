import { DataSource } from 'typeorm';
import { ConfigEnum, CommonRepositoryEnum, CoreRepositoryEnum } from '@shared/enums';
import { CatalogueEntity, FileEntity } from '@common/entities';

export const commonProviders = [
  {
    provide: CommonRepositoryEnum.CATALOGUE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CatalogueEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
  {
    provide: CommonRepositoryEnum.FILE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(FileEntity),
    inject: [ConfigEnum.PG_DATA_SOURCE],
  },
];
