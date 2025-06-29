import { IsString, IsBoolean, IsOptional, IsNotEmpty, MinLength, IsEmail, MaxLength, IsDate } from 'class-validator';
import {
  isBooleanValidationOptions,
  isEmailValidationOptions,
  isNotEmptyValidationOptions,
  isStringValidationOptions,
  maxLengthValidationOptions,
  minLengthValidationOptions,
} from '@shared/validation';
import { CatalogueEntity } from '@common/entities';
import { RoleEntity } from '../../entities/role.entity';

export class UserDto {
  @IsOptional()
  readonly bloodType: CatalogueEntity;

  @IsOptional()
  readonly ethnicOrigin: CatalogueEntity;

  @IsOptional()
  readonly identificationType: CatalogueEntity;

  @IsOptional()
  readonly gender: CatalogueEntity;

  @IsOptional()
  readonly maritalStatus: CatalogueEntity;

  @IsOptional()
  readonly sex: CatalogueEntity;

  @IsOptional()
  readonly avatar: string;

  @IsOptional()
  @IsString()
  readonly birthdate: string;

  @IsOptional()
  @MaxLength(10, maxLengthValidationOptions())
  readonly cellPhone: string;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsString(isStringValidationOptions())
  readonly identification: string;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsEmail({}, isEmailValidationOptions())
  @MaxLength(150, maxLengthValidationOptions())
  readonly email: string;

  @IsOptional()
  @IsDate()
  readonly emailVerifiedAt?: Date;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsString(isStringValidationOptions())
  readonly lastname: string;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsString()
  @MinLength(8, minLengthValidationOptions())
  @MaxLength(32, minLengthValidationOptions())
  readonly password: string;

  @IsOptional()
  @IsBoolean(isBooleanValidationOptions())
  readonly passwordChanged: boolean;

  @IsOptional()
  @IsEmail({}, isEmailValidationOptions())
  @MaxLength(150, maxLengthValidationOptions())
  readonly personalEmail: string;

  @IsOptional()
  @MaxLength(20, minLengthValidationOptions())
  readonly phone: string;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsString(isStringValidationOptions())
  readonly name: string;

  @IsOptional()
  readonly roles?: RoleEntity[];

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsString()
  @MinLength(5, minLengthValidationOptions())
  @MaxLength(100, maxLengthValidationOptions())
  readonly username: string;

  @IsOptional()
  @IsBoolean()
  readonly terminosAceptados?: boolean;

  @IsOptional()
  readonly fechaAceptacionTerminos?: Date;
}
