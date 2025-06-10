import { PickType } from '@nestjs/swagger';
import { UserDto } from '@auth/dto';
import { IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto extends PickType(UserDto, [
  'bloodType',
  'ethnicOrigin',
  'gender',
  'identificationType',
  'maritalStatus',
  'sex',
  'avatar',
  'cellPhone',
  'email',
  'birthdate',
  'emailVerifiedAt',
  'identification',
  'lastname',
  'password',
  'passwordChanged',
  'personalEmail',
  'phone',
  'name',
  'username',
]) {
  @IsOptional()
  @IsUUID()
  role_id?: string;

  @IsOptional()
  @IsBoolean()
  terminosAceptados?: boolean;

  @IsOptional()
  fechaAceptacionTerminos?: Date;
}
