import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { ReportGenaratesService } from './report-genarates/report-genarates.service';
import { ReportHtmlGenaratesService } from './report-html-genarates/report-html-genarates.service';
import { ReportPagesService } from './report-html-genarates/report-pages/report-pages.service';
import { AssessmentPagesService } from './report-html-genarates/assessment-pages/assessment-pages.service';

@Module({
  controllers: [ReportController],
  providers: [ReportService, ReportGenaratesService, ReportHtmlGenaratesService, ReportPagesService, AssessmentPagesService],
  exports: [ReportService,ReportGenaratesService, ReportHtmlGenaratesService],
})
export class ReportModule {}
