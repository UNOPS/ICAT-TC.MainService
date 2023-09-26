import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { AssessmentDto } from './dto/assessment.dto';
import { ReportDto, ReportCoverPage, ReportContentOne, ReportContentTwo } from './dto/report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { AssessmentService } from 'src/assessment/assessment.service';
import { Report } from './entities/report.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Country } from 'src/country/entity/country.entity';
import { ClimateAction } from 'src/climate-action/entity/climate-action.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ReportService extends TypeOrmCrudService<Report>{
  constructor(
    @InjectRepository(Report) repo,
    @InjectRepository(Country) private countryRepo: Repository<Country>,
    private usersService: UsersService,
    public assessmentService: AssessmentService) {
    super(repo)
  }
  create(createReportDto: CreateReportDto) {
    return 'This action adds a new report';
  }

  findAll() {
    return `This action returns all report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }

  async genarateReportDto(createReportDto: CreateReportDto): Promise<ReportDto> {
    const reportDto = new ReportDto();
    reportDto.reportName = createReportDto.reportName;
    reportDto.coverPage = this.genarateReportDtoCoverPage(createReportDto.reportTitle);
    reportDto.contentOne = await this.genarateReportDtoContentOne(createReportDto.assessmentId);
    reportDto.contentTwo = await this.genarateReportDtoContentTwo(createReportDto.assessmentId)

    return reportDto;
  }

  genarateReportDtoCoverPage(title: string): ReportCoverPage {
    const coverPage = new ReportCoverPage();
    coverPage.generateReportName = title;
    coverPage.reportDate = new Date().toDateString();
    coverPage.document_prepared_by = 'user';
    coverPage.companyLogoLink = "http://localhost:7080/report/cover/icatlogo.jpg"
    return coverPage;
  }

  async saveReport(name: string, fileName: string, countryId: number, climateAction: ClimateAction) {
    let country = await this.countryRepo.createQueryBuilder('country').where('id = :id', { id: countryId }).getOne()
    let report = new Report();
    report.reportName = name;
    report.generateReportName = fileName;
    // report.savedLocation = './public/' + fileName;
    report.savedLocation = '/home/ubuntu/code/Main/main/public/' + fileName;
    report.thumbnail = 'https://act.campaign.gov.uk/wp-content/uploads/sites/25/2017/02/form_icon-1.jpg'
    report.country = country
    report.climateAction = climateAction
    return await this.repo.save(report)
  }

  async getReports(
    climateAction: string,
    reportName: string,
    countryIdFromTocken: number
  ) {
    const currentUser = await this.usersService.currentUser()
    let res: Report[] = [];
    if (!climateAction && !reportName) {
      res = await this.repo.find({
        where: {
          country: { id: countryIdFromTocken }
        },
        relations: ['climateAction']
      });
    } else {
      res = await this.repo.find({
        where: {
          climateAction: { policyName: Like(`%${climateAction}%`) },
          reportName: Like(`%${reportName}%`),
          country: { id: countryIdFromTocken }
        },
      });
    }

    let reportList: Report[] = []
    const isUserExternal = currentUser?.userType?.name === 'External';

    for (const x of await res) {
      const isSameUser = x.climateAction.user?.id === currentUser?.id;
      const isMatchingCountry = x.climateAction.user?.country?.id === currentUser?.country?.id;
      const isUserInternal = x.climateAction.user?.userType?.name !== 'External';

      if ((isUserExternal && isSameUser) || (!isUserExternal && isMatchingCountry && isUserInternal)) {
        reportList.push(x);
      }
    }
    return res;
  }


  async genarateReportDtoContentOne(assessmentId: number): Promise<ReportContentOne> {
    const reportContentOne = new ReportContentOne();
    let asse = await this.assessmentService.findbyIDforReport(assessmentId);
    console.log(asse)
    reportContentOne.policyName = asse.climateAction.policyName;
    reportContentOne.assesmentPersonOrOrganization = asse.person;
    reportContentOne.assessmentYear = asse.year;
    reportContentOne.intendedAudience = asse.audience;
    reportContentOne.opportunities = asse.opportunities;
    reportContentOne.objectives = await this.assessmentService.getAssessmentObjectiveforReport(assessmentId);
    reportContentOne.assessmetType = asse.assessmentType;
    reportContentOne.assessmentBoundary = asse.assessBoundry;
    reportContentOne.impactCoverd = asse.impactsCovered;
    reportContentOne.policyOrActionsDetails = [
      {
        information: 'Name',
        description: asse.climateAction.policyName,
      },
      {
        information: 'Type',
        description: asse.climateAction.typeofAction,
      },
      {
        information: 'Description',
        description: asse.climateAction.description,
      },
      {
        information: 'Status',
        description: asse.climateAction.projectStatus ? asse.climateAction.projectStatus.name : '-',
      },
      {
        information: 'Date of implementation',
        description: new Date(asse.climateAction.acceptedDate).toLocaleDateString(),
      },
      {
        information: 'Date of completion (if relevant)',
        description: '-',
      },
      {
        information: 'Implementing entity or entities',
        description: '-',
      },
      {
        information: 'Objectives and benefits ',
        description: asse.climateAction.objective,
      },
      {
        information: 'Level of the policy ',
        description: `${asse.climateAction.subNationalLevl1 ? asse.climateAction.subNationalLevl1 + ' ' : ''}${asse.climateAction.subNationalLevl2 ? asse.climateAction.subNationalLevl2 + ' ' : ''}${asse.climateAction.subNationalLevl3 ? asse.climateAction.subNationalLevl3 : ''}`,
      },
      {
        information: 'Geographic coverage',
        description: '-',
      },
      {
        information: 'Sector  ',
        description: asse.climateAction.sector ? asse.climateAction.sector.name : '-',
      },
      {
        information: 'Other related policies ',
        description: '-',
      },
      {
        information: 'Reference',
        description: '-',
      },

    ];

    reportContentOne.contextOfPolicy = []

    let asssCharacProcess = await this.assessmentService.getCharacteristicasforReport(
      assessmentId,
      'process', ''
    );
    let catagoryProcess = [];
    if (asssCharacProcess) {
      for (let parameter of asssCharacProcess.parameters) {
        let cat = catagoryProcess.find((a) => a.name == parameter.category.name);
        if (cat) {
          cat.characteristics.push({ name: parameter.characteristics.name, relevance: parameter.relevance, comment: parameter.scoreOrInstitutionJusti });
          cat.rows = cat.characteristics.length;
        } else {
          catagoryProcess.push({
            rows: 1,
            name: parameter.category.name,
            characteristics: [{ name: parameter.characteristics.name, relevance: parameter.relevance, comment: parameter.scoreOrInstitutionJusti }],
          });
        }
      }
    }

    let asssCharacOutcome = await this.assessmentService.getCharacteristicasforReport(
      assessmentId,
      'outcome', ''
    );
    let catagoryOutcome = [];
    if (asssCharacOutcome) {
      for (let parameter of asssCharacOutcome.parameters) {
        let cat = catagoryOutcome.find((a) => a.name == parameter.category.name);
        if (cat) {
          cat.characteristics.push({ name: parameter.characteristics.name, relevance: parameter.relevance, comment: parameter.scoreOrInstitutionJusti });
          cat.rows = cat.characteristics.length;
        } else {
          catagoryOutcome.push({
            rows: 1,
            name: parameter.category.name,
            characteristics: [{ name: parameter.characteristics.name, relevance: parameter.relevance, comment: parameter.scoreOrInstitutionJusti }],
          });
        }
      }
    }
    reportContentOne.outcomecharacteristics = catagoryOutcome;
    reportContentOne.prossescharacteristics = catagoryProcess

    return reportContentOne;
  }

  async genarateReportDtoContentTwo(assessmentId: number): Promise<ReportContentTwo> {
    const reportContentTwo = new ReportContentTwo();
    let asssIndicatorsProcess = await this.assessmentService.getCharacteristicasforReport(
      assessmentId,
      'process', ''
    );
    let catagoryProcess = [];
    let catagoryProcessExAnteAssesment = [];
    if (asssIndicatorsProcess) {
      reportContentTwo.assesmentType = asssIndicatorsProcess.assessmentType;

      for (let parameter of asssIndicatorsProcess.parameters) {
        let cat = catagoryProcess.find((a) => a.name == parameter.category.name);
        if (cat) {
          cat.characteristics.push({ name: parameter.characteristics.name, indicator: parameter.indicator ? parameter.indicator.name : '-' });
          cat.rows = cat.characteristics.length;
        } else {
          catagoryProcess.push({
            rows: 1,
            name: parameter.category.name,
            characteristics: [{ name: parameter.characteristics.name, indicator: parameter.indicator ? parameter.indicator.name : '-' }],
          });
        }
      }

      for (let parameter of asssIndicatorsProcess.parameters) {
        let cat = catagoryProcessExAnteAssesment.find((a) => a.name == parameter.category.name);
        if (cat) {
          cat.characteristics.push({ name: parameter.characteristics.name, score: parameter.score, justifying_score: parameter.scoreOrInstitutionJusti, indicator: parameter.indicator ? parameter.indicator.name : '-', indicator_value: parameter.indicatorValue });
          cat.rows = cat.characteristics.length;
        } else {
          catagoryProcessExAnteAssesment.push({
            rows: 1,
            name: parameter.category.name,
            characteristics: [{ name: parameter.characteristics.name, score: parameter.score, justifying_score: parameter.scoreOrInstitutionJusti, indicator: parameter.indicator ? parameter.indicator.name : '-', indicator_value: parameter.indicatorValue }],
          });
        }
      }
    }

    let asssIndicatorOutcome = await this.assessmentService.getCharacteristicasforReport(
      assessmentId,
      'outcome', ''
    );
    let catagoryOutcome = [];
    let catagoryOutcomeExAnteAssesment = [];
    if (asssIndicatorsProcess) {
      for (let parameter of asssIndicatorOutcome.parameters) {
        let cat = catagoryOutcome.find((a) => a.name == parameter.category.name);
        if (cat) {
          cat.characteristics.push({ name: parameter.characteristics.name, indicator: parameter.indicator ? parameter.indicator.name : '-' });
          cat.rows = cat.characteristics.length;
        } else {
          catagoryOutcome.push({
            rows: 1,
            name: parameter.category.name,
            characteristics: [{ name: parameter.characteristics.name, indicator: parameter.indicator ? parameter.indicator.name : '-' }],
          });
        }
      }

      for (let parameter of asssIndicatorOutcome.parameters) {
        let cat = catagoryOutcomeExAnteAssesment.find((a) => a.name == parameter.category.name);
        if (cat) {
          cat.characteristics.push({ name: parameter.characteristics.name, score: parameter.score, justifying_score: parameter.scoreOrInstitutionJusti, indicator: parameter.indicator ? parameter.indicator.name : '-', indicator_starting_value: "-", indicator_value: parameter.indicatorValue });
          cat.rows = cat.characteristics.length;
        } else {
          catagoryOutcomeExAnteAssesment.push({
            rows: 1,
            name: parameter.category.name,
            characteristics: [{ name: parameter.characteristics.name, score: parameter.score, justifying_score: parameter.scoreOrInstitutionJusti, indicator: parameter.indicator ? parameter.indicator.name : '-', indicator_value: parameter.indicatorValue }],
          });
        }
      }
    }

    reportContentTwo.prossesAssesmentStartingSituation = catagoryProcess;
    reportContentTwo.outcomeAssesmentStartingSituation = catagoryOutcome;
    reportContentTwo.prossesExAnteAssesment = catagoryProcessExAnteAssesment;
    reportContentTwo.outcomeExAnteAssesment = catagoryOutcomeExAnteAssesment;

    let asssResulrProcess = await this.assessmentService.getCharacteristicasforReport(
      assessmentId,
      'process', ''
    );
    let prossesDescribeResult = [];
    if (asssResulrProcess) {
      for (let parameter of asssResulrProcess.parameters) {
        let cat = prossesDescribeResult.find((a) => a.name == parameter.category.name);
        if (cat) {
          cat.score = parameter.score,
            cat.justifying_score = parameter.scoreOrInstitutionJusti,
            cat.relative_importance = ''
        } else {
          prossesDescribeResult.push({
            name: parameter.category.name,
            score: parameter.score,
            justifying_score: parameter.scoreOrInstitutionJusti,
            relative_importance: ''
          });
        }
      }
    }

    let asssResultOutcome = await this.assessmentService.getResultforReport(
      assessmentId,
      'outcome', ''
    );
    let outcomeDescribeResult = [];
    if (asssResultOutcome) {
      for (let parameter of asssResultOutcome.parameters) {
        console.log(parameter);
        let cat = outcomeDescribeResult.find((a) => a.name == parameter.category.name);
        if (cat) {
          cat.score = parameter.score,
            cat.justifying_score = parameter.scoreOrInstitutionJusti,
            cat.relative_importance = ''
        } else {
          outcomeDescribeResult.push({
            name: parameter.category.name,
            score: parameter.score,
            justifying_score: parameter.scoreOrInstitutionJusti,
            relative_importance: ''
          });
        }
      }
    }

    reportContentTwo.prossesDescribeResult = prossesDescribeResult;
    reportContentTwo.outcomeDescribeResult = outcomeDescribeResult;
    return reportContentTwo;
  }

  genarateAssessmentDto(): AssessmentDto {
    return new AssessmentDto();
  }
}
