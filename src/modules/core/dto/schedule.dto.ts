import { IsNotEmpty, IsNumber, Min, Max, IsString, IsIn } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(23)
  hourStartedAt: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(59)
  minuteStartedAt: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(23)
  hourEndedAt: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(59)
  minuteEndedAt: number;

  @IsNumber()
  @Min(0)
  @Max(120)
  minutesLunch?: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['morning', 'afternoon', 'night'])
  shiftType: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek: number;
}

export class UpdateScheduleDto extends CreateScheduleDto {} 