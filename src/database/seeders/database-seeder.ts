import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { RolesSeeder } from '@database/seeders';
import { UsersSeeder } from './users-seeder';
import { CataloguesSeeder } from './catalogues-seeder';

@Injectable()
export class DatabaseSeeder {
  constructor(
    private rolesSeeder: RolesSeeder,
    private usersSeeder: UsersSeeder,
    private cataloguesSeeder: CataloguesSeeder,
  ) {}

  async run() {
    /** Auth Seeders **/
    await this.rolesSeeder.run();
    await this.usersSeeder.run();
    await this.cataloguesSeeder.run();
    this.createUploadsDirectories();
  }

  createUploadsDirectories() {
    const date = new Date();
    for (let i = date.getFullYear(); i < date.getFullYear() + 20; i++) {
      const path = join(process.cwd(), 'storage/private/uploads', i.toString());
      fs.mkdir(path, err => {
        if (err) {
          // console.log(err);
        }
      });

      for (let j = 1; j <= 12; j++) {
        const path = join(process.cwd(), 'storage/private/uploads', i.toString());
        fs.mkdir(path, err => {
          if (err) {
            // console.log(err);
          }
        });
      }
    }
  }
}
