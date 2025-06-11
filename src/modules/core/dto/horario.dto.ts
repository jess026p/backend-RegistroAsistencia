import { IsNotEmpty, IsString, IsUUID, IsArray, IsInt,IsOptional, IsNumber, Min, Max, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class CreateHorarioDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  nombreTurno?: string;

  @IsNotEmpty({ message: 'Los días son requeridos' })
  @IsArray({ message: 'Los días deben ser un array' })
  @ArrayMinSize(1, { message: 'Debe seleccionar al menos un día' })
  @ArrayMaxSize(7, { message: 'No puede seleccionar más de 7 días' })
  @IsInt({ each: true, message: 'Cada día debe ser un número entero' })
  @Min(1, { each: true, message: 'Los días deben estar entre 1 y 7' })
  @Max(7, { each: true, message: 'Los días deben estar entre 1 y 7' })
  dias: number[];

  @IsNotEmpty({ message: 'La hora de inicio es requerida' })
  @IsString({ message: 'La hora de inicio debe ser una cadena de texto' })
  horaInicio: string;

  @IsNotEmpty({ message: 'La hora de fin es requerida' })
  @IsString({ message: 'La hora de fin debe ser una cadena de texto' })
  horaFin: string;

  @IsOptional()
  @IsString()
  fechaInicio?: string;


  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(60)
  toleranciaInicioAntes?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(60)
  toleranciaInicioDespues?: number;

  

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(60)
  atrasoPermitido?: number;

  @IsOptional()
  @IsString()
  fechaFinRepeticion?: string;

  @IsOptional()
  @IsString()
  ubicacionNombre?: string;

  @IsOptional()
  @IsNumber()
  ubicacionLat?: number;

  @IsOptional()
  @IsNumber()
  ubicacionLng?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  radioUbicacion?: number;
}

export class UpdateHorarioDto extends CreateHorarioDto {} 