import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDateString,
  IsNumber,
  IsOptional,
  IsIn
} from 'class-validator';

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

  @IsString()
  @IsIn(['entrada', 'salida', 'atraso', 'presente', 'fuera_de_zona', 'fuera_de_rango'])
  estado: string;


  @IsOptional()
  @IsString()
  motivo?: string;
}
