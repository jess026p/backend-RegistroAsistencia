// src/modules/auth/dto/users/register.dto.ts
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsEmail, IsDate, IsBoolean } from 'class-validator';

export class RegisterUserEmployeeDto {
  // Campos OBLIGATORIOS
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  identification: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsUUID()
  position_id: string;

  // Nuevos campos OBLIGATORIOS
  @IsNotEmpty()
  @IsUUID()
  marital_status_id: string;  // Estado civil

  @IsNotEmpty()
  @IsUUID()
  gender_id: string;  // Género

  @IsNotEmpty()
  @IsUUID()
  identification_type_id: string;  // Tipo de identificación

  @IsNotEmpty()
  @IsUUID()
  role_id: string;  // Rol del usuario

  // Campos OPCIONALES
  @IsOptional()
  @IsEmail()
  personal_email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  cell_phone?: string;

  @IsOptional()
  @IsString()
  birthdate?: string;

  @IsOptional()
  @IsUUID()
  blood_type_id?: string;

  @IsOptional()
  @IsUUID()
  ethnic_origin_id?: string;

  @IsOptional()
  @IsUUID()
  sex_id?: string;

  @IsOptional()
  @IsUUID()
  nationality_id?: string;

  @IsOptional()
  @IsUUID()
  schedule_id?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean = true;
}