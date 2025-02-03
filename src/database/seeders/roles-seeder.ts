import { Injectable } from '@nestjs/common';
import { RolesService } from '@auth/services';
import { CreateRoleDto } from '@auth/dto';
import { RoleEnum } from '@auth/enums';

@Injectable()
export class RolesSeeder {
  constructor(private rolesService: RolesService) {}

  async run() {
    await this.createRoles();
  }

  private async createRoles() {
    const roles: CreateRoleDto[] = [];
    roles.push(
      // {
      //   code: RoleEnum.ADMIN,
      //   name: 'Admin',
      // },
      {
        code: RoleEnum.EMPLOYEE,
        name: 'Empleado',
      },
      {
        code: RoleEnum.MANAGER,
        name: 'Administrador',
      },
    );

    for (const role of roles) {
      await this.rolesService.create(role);
    }
  }
}
