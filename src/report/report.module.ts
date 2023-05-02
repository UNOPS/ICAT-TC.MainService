import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { ReportGenaratesService } from './report-genarates/report-genarates.service';
import { ReportHtmlGenaratesService } from './report-html-genarates/report-html-genarates.service';
import { ReportPagesService } from './report-html-genarates/report-pages/report-pages.service';
import { AssessmentPagesService } from './report-html-genarates/assessment-pages/assessment-pages.service';
import { Report } from './entities/report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { AssessmentService } from 'src/assessment/assessment.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { AssessmentModule } from 'src/assessment/assessment.module';
import { EmailNotificationService } from 'src/notifications/email.notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Report,Assessment]),UsersModule],
  controllers: [ReportController],
  providers: [ReportService, ReportGenaratesService, ReportHtmlGenaratesService, ReportPagesService, AssessmentPagesService,AssessmentService,EmailNotificationService],
  exports: [ReportService,ReportGenaratesService, ReportHtmlGenaratesService,AssessmentService,EmailNotificationService],
})
export class ReportModule {}
