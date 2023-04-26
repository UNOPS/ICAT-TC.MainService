import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

import { AssessmentDto } from './dto/assessment.dto';
import { ReportDto, ReportCoverPage, ReportContentOne, ReportContentTwo } from './dto/report.dto';

@Injectable()
export class ReportService {
  create(createReportDto: CreateReportDto) {
    return 'This action adds a new report';
  }

  findAll() {
    return `This action returns all report`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }

  genarateReportDto(createReportDto: CreateReportDto): ReportDto {
    const reportDto = new ReportDto();
    reportDto.reportName = 'reportPDF.pdf';
    reportDto.coverPage = this.genarateReportDtoCoverPage();
    reportDto.contentOne=this.genarateReportDtoContentOne();
    reportDto.contentTwo=this.genarateReportDtoContentTwo()

    return reportDto;
  }

  genarateReportDtoCoverPage(): ReportCoverPage {
    const coverPage = new ReportCoverPage();
    coverPage.generateReportName = 'Report Title';
    coverPage.reportDate = new Date().toDateString();
    coverPage.document_prepared_by = 'user';
    coverPage.companyLogoLink="http://localhost:7080/report/cover/icatlogo.jpg"
    return coverPage;
  }



  genarateReportDtoContentOne(): ReportContentOne {
    const reportContentOne = new ReportContentOne();

    
    return reportContentOne;
  }
  genarateReportDtoContentTwo(): ReportContentTwo {
    const reportContentTwo = new ReportContentTwo();
    
    return reportContentTwo;
  }

  genarateAssessmentDto(): AssessmentDto {
    return new AssessmentDto();
  }
}
