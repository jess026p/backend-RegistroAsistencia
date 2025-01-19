import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@auth/dto';
import { UsersService } from '../../modules/auth/services/users.service';
import { RolesService } from '@auth/services';

@Injectable()
export class UsersSeeder {

  constructor(private usersService: UsersService,private rolesService: RolesService) {
  }

  async run() {
    await this.createUsers();
  }

  private async createUsers() {
    const roles = (await this.rolesService.findAll()).data;
    console.log(roles);

    const users: CreateUserDto[] = [];
    users.push(
      {
        identification: '1',
        name: 'Admin',
        lastname: 'Admin',
        password: '1234',
        passwordChanged: true,
        roles: roles,
        username: 'admin',
        email: 'admin@admin.com',
        identificationType: null,
      },
    );

    for (const user of users) {
      await this.usersService.create(user);
    }
  }
}
