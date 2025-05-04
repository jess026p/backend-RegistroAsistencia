import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { CoreRepositoryEnum } from 'src/shared/enums/core-repository.enum';
import { HorarioEntity } from '../entities/horario.entity';
import { CreateHorarioDto, UpdateHorarioDto } from '../dto/horario.dto';

@Injectable()
export class HorarioService {
  constructor(
    @Inject(CoreRepositoryEnum.HORARIO_REPOSITORY) private readonly repository: Repository<HorarioEntity>,
  ) {}

  async create(payload: CreateHorarioDto): Promise<HorarioEntity> {
    const horario = this.repository.create(payload);
    return await this.repository.save(horario);
  }

  async findAll(): Promise<HorarioEntity[]> {
    return await this.repository.find({
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<HorarioEntity> {
    const horario = await this.repository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!horario) {
      throw new NotFoundException(`Horario no encontrado`);
    }

    return horario;
  }

  async update(id: string, payload: UpdateHorarioDto): Promise<HorarioEntity> {
    const horario = await this.repository.findOneBy({ id });

    if (!horario) {
      throw new NotFoundException(`Horario no encontrado`);
    }

    this.repository.merge(horario, payload);
    return await this.repository.save(horario);
  }

  async delete(id: string): Promise<HorarioEntity> {
    const horario = await this.repository.findOneBy({ id });

    if (!horario) {
      throw new NotFoundException(`Horario no encontrado`);
    }

    return await this.repository.softRemove(horario);
  }
} 