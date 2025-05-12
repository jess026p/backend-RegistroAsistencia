import { PickType } from '@nestjs/swagger';
import { UserDto } from '@auth/dto';

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
]) {}
