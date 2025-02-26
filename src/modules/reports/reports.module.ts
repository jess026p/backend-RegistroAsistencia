import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { DatabaseModule } from '@database';
import { PrinterService } from './services';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import { ReportsSql } from './services/reports.sql';

@Global()
@Module({
  imports: [DatabaseModule, CacheModule.register()],
  controllers: [ReportsController],
  providers: [PrinterService, ReportsService, ReportsSql],
  exports: [],
})
export class ReportsModule {}
