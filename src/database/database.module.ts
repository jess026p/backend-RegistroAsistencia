import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { DatabaseSeeder, MenusSeeder, RolesSeeder } from '@database/seeders';
import { UsersSeeder } from './seeders/users-seeder';
import { CataloguesSeeder } from './seeders/catalogues-seeder';
//import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [
   // TypeOrmModule.forRoot(),
  ],
  providers: [
    ...databaseProviders,
    DatabaseSeeder,
    MenusSeeder,
    RolesSeeder,
    UsersSeeder,
    CataloguesSeeder,
  ],
  exports: [
    ...databaseProviders,
    DatabaseSeeder,
   // TypeOrmModule,
  ],
})
export class DatabaseModule {}
