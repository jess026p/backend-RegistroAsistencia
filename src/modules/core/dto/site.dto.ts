// src/modules/core/dto/site.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsUUID, IsArray, IsOptional } from 'class-validator';

export class CreateSiteDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @IsNotEmpty()
  @IsNumber()
  radius: number;

  @IsNotEmpty()
  @IsUUID()
  employeeId: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  scheduleIds?: string[];
}

export class UpdateSiteDto extends CreateSiteDto {}