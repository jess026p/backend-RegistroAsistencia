import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CatalogueEntity } from '@common/entities';

export class SeedUserDto {
  @IsString()
  @IsNotEmpty()
  identification: string;

  @IsString()
  @IsNotEmpty()
  identificationType: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  passwordChanged: boolean;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;
} 