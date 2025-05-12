import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@auth/dto';
import { UsersService } from '../../modules/auth/services/users.service';
import { RolesService } from '@auth/services';
import * as Bcrypt from 'bcrypt';

@Injectable()
export class UsersSeeder {

  constructor(private usersService: UsersService,private rolesService: RolesService) {
  }

  async run() {
    await this.createUsers();
  }

  private async createUsers() {
    const roles = (await this.rolesService.findAll()).data;

    const users: any[] = [
      {
        identification: '9999999999',
        identificationType: '1',
        lastname: 'Administrador',
        name: 'Administrador',
        password: await Bcrypt.hash('12345678', 10),
        passwordChanged: false,
        email: 'admin@yavirac.edu.ec',
        username: 'admin',
      },
    ];

    for (const user of users) {
      await this.usersService.create(user);
    }
  }
}
