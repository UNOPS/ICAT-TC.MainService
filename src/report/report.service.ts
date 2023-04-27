import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

import { AssessmentDto } from './dto/assessment.dto';
import { ReportDto, ReportCoverPage, ReportContentOne, ReportContentTwo } from './dto/report.dto';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssessmentService } from 'src/assessment/assessment.service';

@Injectable()
export class ReportService {
  constructor( 
  public  assessmentService:AssessmentService  ){

  }
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

  async genarateReportDto(createReportDto: CreateReportDto): Promise<ReportDto> {
    const reportDto = new ReportDto();
    reportDto.reportName = 'reportPDF.pdf';
    reportDto.coverPage = this.genarateReportDtoCoverPage();
    reportDto.contentOne=await this.genarateReportDtoContentOne(createReportDto.assessmentId);
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



  async genarateReportDtoContentOne(assessmentId:number): Promise<ReportContentOne> {
    const reportContentOne = new ReportContentOne();

   //genaral details
      
let asse= await this.assessmentService.findbyIDforReport(assessmentId)
      console.log(asse)
      reportContentOne.policyName=asse.climateAction.policyName;
      reportContentOne.assesmentPersonOrOrganization=asse.climateAction.contactPersoFullName;
      reportContentOne.assessmentYear=asse.year;
      
      reportContentOne.assessmetType=asse.climateAction.policyName;
      // reportContentOne.assessmentBoundary=asse.climateAction.policyName;
      reportContentOne.policyOrActionsDetails=[
        {
          information: 'Name',
          description: asse.climateAction.policyName,
        },
        {
          information: 'Type',
          description:  asse.climateAction.typeofAction,
        },
        {
          information: 'Description',
          description:  asse.climateAction.description,
        },
        {
          information: 'Status',
          description:  asse.climateAction.projectStatus?asse.climateAction.projectStatus.name:'-',
        },
        {
          information: 'Date of implementation',
          description:  new Date(asse.climateAction.acceptedDate).toLocaleDateString(),
        },
        {
          information: 'Date of completion (if relevant)',
          description:  '-',
        },
        {
          information: 'Implementing entity or entities',
          description:  '-',
        },
        {
          information: 'Objectives and benefits ',
          description:  asse.climateAction.objective,
        },
        {
          information: 'Level of the policy ',
          description:  `${asse.climateAction.subNationalLevl1?asse.climateAction.subNationalLevl1 +' ':''}${asse.climateAction.subNationalLevl2?asse.climateAction.subNationalLevl2 +' ':''}${asse.climateAction.subNationalLevl3?asse.climateAction.subNationalLevl3:''}`,
        },
        {
          information: 'Geographic coverage',
          description:  '-',
        },
        {
          information: 'Sector  ',
          description:  asse.climateAction.sector?asse.climateAction.sector.name:'-',
        },
        {
          information: 'Other related policies ',
          description:  '-',
        },
        {
          information: 'Reference',
          description:  '-',
        },
        
      ];

      reportContentOne.contextOfPolicy=[

        
      ]
    
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
