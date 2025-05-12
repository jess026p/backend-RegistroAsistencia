import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PermissionEntity } from '@auth/entities';
import { AuthRepositoryEnum } from '@shared/enums';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject(AuthRepositoryEnum.PERMISSION_REPOSITORY)
    private repository: Repository<PermissionEntity>,
  ) {}
} 