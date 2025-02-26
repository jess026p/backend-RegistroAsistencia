import { Controller, Get, HttpCode, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseHttpModel } from '@shared/models';
import { Response } from 'express';
import { ReportsService } from '../services/reports.service';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @ApiOperation({ summary: 'Late Attendances' })
  @Get('attendances/late')
  @HttpCode(HttpStatus.OK)
  async generateAttendanceLate(@Res() response: Response, @Query('startedAt') startedAt: Date, @Query('endedAt') endedAt: Date): Promise<ResponseHttpModel> {
    const pdfDoc = await this.reportsService.generateLateAttendances(startedAt, endedAt);

    response.setHeader('Content-Type', 'application/pdf');

    pdfDoc.info.Title = 'Reporte de atrasados';
    pdfDoc.pipe(response);
    pdfDoc.end();

    return {
      data: null,
      message: `Student Card`,
      title: `Report`,
    };
  }
}
