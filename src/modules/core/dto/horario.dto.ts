import { IsNotEmpty, IsString, IsUUID, IsArray, IsInt, IsBoolean, IsOptional, IsDate, IsNumber, Min, Max, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class CreateHorarioDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  nombreTurno?: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(7, { each: true })
  dias: number[];

  @IsNotEmpty()
  @IsString()
  horaInicio: string;

  @IsNotEmpty()
  @IsString()
  horaFin: string;

  @IsOptional()
  @IsDate()
  fechaInicio?: Date;

  @IsOptional()
  @IsDate()
  fechaFin?: Date;

  @IsOptional()
  @IsString()
  horaAlmuerzoSalida?: string;

  @IsOptional()
  @IsString()
  horaAlmuerzoRegreso?: string;

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
  toleranciaFinDespues?: number;

  @IsOptional()
  @IsBoolean()
  repetirTurno?: boolean;

  @IsOptional()
  @IsDate()
  fechaFinRepeticion?: Date;

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