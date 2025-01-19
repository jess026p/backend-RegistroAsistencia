import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SignerEntity } from '@core/entities';
import { CoreRepositoryEnum } from '@shared/enums';

@Injectable()
export class SignerService {
  constructor(
    @Inject(CoreRepositoryEnum.SIGNER_REPOSITORY) private readonly repository: Repository<SignerEntity>,
  ) {}

  // Crear firmante
  async create(payload: any): Promise<SignerEntity> {
    const entity = this.repository.create();
    entity.signerName = payload.signerName;
    entity.position = payload.position;

    return await this.repository.save(entity);
  }

  // Encontrar todos los firmantes
  async findAll(): Promise<SignerEntity[]> {
    return await this.repository.find({
      relations: { form: true },
    });
  }

  // Encontrar firmante por ID
  async findOne(id: string): Promise<SignerEntity> {
    const entity = await this.repository.findOne({
      relations: { form: true },
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

    return entity;
  }

  // Actualizar firmante
  async update(id: string, payload: any): Promise<SignerEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

    entity.signerName = payload.signerName;
    entity.position = payload.position;

    return await this.repository.save(entity);
  }

  // Eliminar firmante (borrado lógico)
  async delete (id: string): Promise<SignerEntity> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException(`Registro no encontrado`);
    }

   return await this.repository.softRemove(entity);
  }
}
