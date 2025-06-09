import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { FindOptionsWhere, ILike, LessThan, Repository, In } from 'typeorm';
import { CreateUserDto, FilterUserDto, ReadUserDto, UpdateUserDto } from '@auth/dto';
import { MAX_ATTEMPTS } from '@auth/constants';
import { UserEntity } from '@auth/entities';
import { PaginationDto } from '@core/dto';
import { ServiceResponseHttpModel } from '@shared/models';
import { AuthRepositoryEnum } from '@shared/enums';
import { RoleEnum } from '@auth/enums';
import { RoleEntity } from '../entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(AuthRepositoryEnum.USER_REPOSITORY) private repository: Repository<UserEntity>,
    @Inject(AuthRepositoryEnum.ROLE_REPOSITORY) private roleRepository: Repository<RoleEntity>,
  ) {}

  async create(payload: CreateUserDto): Promise<UserEntity> {
    const data = { ...payload };
    if (data.birthdate && typeof data.birthdate !== 'string') {
      data.birthdate = (data.birthdate as Date).toISOString().slice(0, 10);
    }
    const newUser = this.repository.create(data);

    if (payload.identificationType) {
      newUser.identificationTypeId = typeof payload.identificationType === 'string'
        ? payload.identificationType
        : payload.identificationType.id;
    }
    if (payload.gender) {
      newUser.genderId = typeof payload.gender === 'string'
        ? payload.gender
        : payload.gender.id;
    }
    if (typeof newUser.gender === 'string') newUser.gender = undefined;
    if (typeof newUser.identificationType === 'string') newUser.identificationType = undefined;

    if (payload.role_id) {
      const role = await this.roleRepository.findOne({ where: { id: payload.role_id } });
      if (!role) throw new NotFoundException('Rol no encontrado');
      newUser.roles = [role];
    }

    // Validar si el username ya existe
    const existeUsername = await this.repository.findOne({ where: { username: payload.username } });
    if (existeUsername) {
      throw new BadRequestException('El nombre de usuario ya existe');
    }

    // Validar si el email ya existe
    const existeEmail = await this.repository.findOne({ where: { email: payload.email } });
    if (existeEmail) {
      throw new BadRequestException('El correo electrónico ya existe');
    }

    console.log('Usuario a guardar (create):', newUser);

    const savedUser = await this.repository.save(newUser);

    // Vuelve a consultar el usuario con las relaciones
    return await this.repository.findOne({
      where: { id: savedUser.id },
      relations: {
        identificationType: true,
        gender: true,
        roles: true,
      },
    });
  }

  async catalogue(): Promise<ServiceResponseHttpModel> {
    const response = await this.repository.findAndCount({ take: 1000 });

    return {
      data: response[0],
      pagination: { totalItems: response[1], limit: 10 },
    };
  }

  async findAll(params?: FilterUserDto): Promise<ServiceResponseHttpModel> {
    const relations = { roles: true, horarios: true };
    //Pagination & Filter by Search
    if (params?.limit > 0 && params?.page >= 0) {
      return await this.paginateAndFilter(params, relations);
    }
    //Other filters
    if (params?.birthdate) {
      return this.filterByBirthdate(params.birthdate);
    }

    //All
    const response = await this.repository.findAndCount({
      relations,
      order: { updatedAt: 'DESC' },
    });

    return {
      data: response[0],
      pagination: { totalItems: response[1], limit: 10 },
    };
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.repository.findOne({
      where: { id },
      relations: {
        roles: true,
        identificationType: true,
        gender: true,
      },
      select: { password: false },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado (find one)');
    }

    return user;
  }

  async findByUsername(username: string): Promise<UserEntity> {
    const user = await this.repository.findOne({
      where: { username },
      select: { password: false },
    });

    if (!user) {
      throw new NotFoundException('Nombre de usuario no existe');
    }

    return user;
  }

  async update(id: string, payload: UpdateUserDto): Promise<UserEntity> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado para actualizar');

    const data = { ...payload };
    if (data.birthdate && typeof data.birthdate !== 'string') {
      data.birthdate = (data.birthdate as Date).toISOString().slice(0, 10);
    }
    this.repository.merge(user, data);

    if (payload.identificationType) {
      user.identificationTypeId = typeof payload.identificationType === 'string'
        ? payload.identificationType
        : payload.identificationType.id;
    }
    if (payload.gender) {
      user.genderId = typeof payload.gender === 'string'
        ? payload.gender
        : payload.gender.id;
    }
    if (typeof user.gender === 'string') user.gender = undefined;
    if (typeof user.identificationType === 'string') user.identificationType = undefined;

    console.log('Usuario a guardar (update):', user);

    await this.repository.save(user);

    // Vuelve a consultar el usuario con las relaciones
    return await this.repository.findOne({
      where: { id },
      relations: {
        roles: true,
        identificationType: true,
        gender: true,
      },
    });
  }

  async reactivate(id: string): Promise<ReadUserDto> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado para reactivar');
    }

    user.suspendedAt = null;
    user.maxAttempts = MAX_ATTEMPTS;

    const userUpdated = await this.repository.save(user);

    return plainToInstance(ReadUserDto, userUpdated);
  }

  async remove(id: string): Promise<ReadUserDto> {
    const user = await this.repository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado para eliminar');
    }

    const userDeleted = await this.repository.softRemove(user);

    return plainToInstance(ReadUserDto, userDeleted);
  }

  async removeAll(payload: UserEntity[]): Promise<UserEntity> {
    const usersDeleted = await this.repository.softRemove(payload);
    return usersDeleted[0];
  }

  private async paginateAndFilter(params: FilterUserDto, relations: any): Promise<ServiceResponseHttpModel> {
    let where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[];
    where = {};
    let { page, search } = params;
    const { limit } = params;

    if (search) {
      search = search.trim();
      page = 0;
      where = [];
      where.push({ identification: ILike(`%${search}%`) });
      where.push({ lastname: ILike(`%${search}%`) });
      where.push({ name: ILike(`%${search}%`) });
      where.push({ username: ILike(`%${search}%`) });
      where.push({ roles: { name: ILike(`%${search}%`) } });
    }

    const response = await this.repository.findAndCount({
      where,
      relations,
      take: limit,
      skip: PaginationDto.getOffset(limit, page),
      order: {
        updatedAt: 'DESC',
      },
    });

    return {
      data: plainToInstance(ReadUserDto, response[0]),
      pagination: { limit, totalItems: response[1] },
    };
  }

  private async filterByBirthdate(birthdate: string): Promise<ServiceResponseHttpModel> {
    const where: FindOptionsWhere<UserEntity> = {};

    if (birthdate) {
      where.birthdate = birthdate;
    }

    const response = await this.repository.findAndCount({ where });

    return {
      data: plainToInstance(ReadUserDto, response[0]),
      pagination: { limit: 10, totalItems: response[1] },
    };
  }

  async suspend(id: string): Promise<ReadUserDto> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado para suspender');
    }

    user.suspendedAt = new Date();

    const userUpdated = await this.repository.save(user);

    return plainToInstance(ReadUserDto, userUpdated);
  }

  async assignRoles(userId: string, roleIds: string[]): Promise<UserEntity> {
    const user = await this.repository.findOne({
      where: { id: userId },
      relations: { roles: true },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const roles = await this.roleRepository.findBy({ id: In(roleIds) });
    user.roles = roles;

    return await this.repository.save(user);
  }

  async enable(id: string): Promise<UserEntity> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    user.enabled = true;
    return await this.repository.save(user);
  }

  async disable(id: string): Promise<UserEntity> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    user.enabled = false;
    return await this.repository.save(user);
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await this.repository.findOne({ where: { email: email.toLowerCase().trim() } });
    return !!user;
  }

  async usernameExists(username: string): Promise<boolean> {
    const user = await this.repository.findOne({ where: { username: username.trim() } });
    return !!user;
  }
}
