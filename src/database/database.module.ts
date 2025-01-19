import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { DatabaseSeeder, RolesSeeder } from '@database/seeders';
import { UsersSeeder } from './seeders/users-seeder';
import { CataloguesSeeder } from './seeders/catalogues-seeder';

@Global()
@Module({
  providers: [...databaseProviders, DatabaseSeeder, RolesSeeder, UsersSeeder,CataloguesSeeder],
  exports: [...databaseProviders, DatabaseSeeder],
})
export class DatabaseModule {}
