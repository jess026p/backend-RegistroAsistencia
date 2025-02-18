import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordChangeFirstDto {

  @IsNotEmpty()
  @IsString()
  passwordNew: string;


}
