import { PartialType } from '@nestjs/swagger';
import { CreateCatalogueDto } from '@common/dto';

export class UpdateCatalogueDto extends PartialType(CreateCatalogueDto) {}
