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

  @IsOptional()
  @IsIn(['entrada', 'salida', 'atraso', 'presente', 'fuera_de_zona', 'fuera_de_rango'])
  estado: string;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsString()
  hora_salida?: string;

  @IsOptional()
  @IsNumber()
  lat_salida?: number;

  @IsOptional()
  @IsNumber()
  lng_salida?: number;

  @IsOptional()
  @IsString()
  @IsIn(['entrada', 'salida', 'atraso', 'presente', 'fuera_de_zona', 'fuera_de_rango'])
  estado_salida?: string;

  @IsOptional()
  @IsString()
  motivo_salida?: string;
}

export class ResumenAsistenciaDto {
  registro_hoy: {
    entrada: number;
    salida: number;
    atrasos: number;
    fuera_zona: number;
  };
  resumen_mes: {
    total_dias: number;
    dias_asistidos: number;
    dias_faltados: number;
    atrasos: number;
    fuera_zona: number;
  };
}
