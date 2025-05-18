import { IsNotEmpty, IsString, IsUUID, IsDateString, IsNumber, IsOptional, IsIn, IsInt } from 'class-validator';

export class CreateAsistenciaDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  horarioId: string;

  @IsNotEmpty()
  @IsDateString()
  fecha: string;

  @IsNotEmpty()
  @IsString()
  hora: string;

  @IsNotEmpty()
  @IsNumber()
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  lng: number;

  @IsNotEmpty()
  @IsIn(['entrada', 'salida', 'atraso', 'fuera_de_zona', 'fuera_de_rango'])
  estado: 'entrada' | 'salida' | 'atraso' | 'fuera_de_zona' | 'fuera_de_rango';

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsNotEmpty()
  @IsIn(['entrada', 'salida'])
  tipo: 'entrada' | 'salida';

  @IsOptional()
  @IsInt()
  atrasoPermitido?: number;
} 