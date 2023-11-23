import { Injectable } from '@nestjs/common';
import { CreateComparisonReportDto, CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { AssessmentDto } from './dto/assessment.dto';
import {
  ReportDto,
  ReportCoverPage,
  ReportContentOne,
  ReportContentTwo,
  ComparisonReportDto,
  ComparisonReportReportCoverPage,
  ComparisonReportReportContentOne,
  ComparisonReportReportContentTwo,
  ComparisonReportReportContentThree,
  ComparisonReportReportContentFour,
  ReportCarbonMarketDto,
  ReportCarbonMarketDtoContentOne,
  ReportCarbonMarketDtoContentThree,
  ReportCarbonMarketDtoContentTwo,
  ReportCarbonMarketDtoContentFour,
  ReportCarbonMarketDtoContentFive,
  ReportCarbonMarketDtoCoverPage,
} from './dto/report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { AssessmentService } from 'src/assessment/assessment.service';
import { Report } from './entities/report.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Country } from 'src/country/entity/country.entity';
import { ClimateAction } from 'src/climate-action/entity/climate-action.entity';
import { UsersService } from 'src/users/users.service';
import { InvestorToolService } from 'src/investor-tool/investor-tool.service';
import { PortfolioService } from 'src/portfolio/portfolio.service';
import { ComparisonDto, ComparisonTableDataDto } from 'src/portfolio/dto/comparison.dto';
import { Portfolio, } from 'src/portfolio/entities/portfolio.entity';
import { PortfolioAssessment } from 'src/portfolio/entities/portfolioAssessment.entity';
import { InvestorTool } from 'src/investor-tool/entities/investor-tool.entity';

@Injectable()
export class ReportService extends TypeOrmCrudService<Report> {
  constructor(
    @InjectRepository(Report) repo,
    @InjectRepository(Country) private countryRepo: Repository<Country>,
    @InjectRepository(Portfolio) private portfolioRepo: Repository<Portfolio>,
    @InjectRepository(PortfolioAssessment) private portfolioAssessRepo: Repository<PortfolioAssessment>,
    private usersService: UsersService,
    public assessmentService: AssessmentService,
    private readonly investorToolService: InvestorToolService,
    private readonly portfolioService: PortfolioService
  ) {
    super(repo);
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

  async genarateReportDto(
    createReportDto: CreateReportDto,
  ): Promise<ReportDto> {
    const reportDto = new ReportDto();
    reportDto.reportName = createReportDto.reportName;
    reportDto.coverPage = this.genarateReportDtoCoverPage(
      createReportDto.reportTitle,createReportDto.tool
    );
    reportDto.contentOne = await this.genarateReportDtoContentOne(
      createReportDto.assessmentId,createReportDto.tool
    );
    reportDto.contentTwo = await this.genarateReportDtoContentTwo(
      createReportDto.assessmentId,createReportDto.tool
    );
    return reportDto;
  }

  genarateReportDtoCoverPage(title: string,tool:string): ReportCoverPage {
    const coverPage = new ReportCoverPage();
    coverPage.tool = tool;
    coverPage.generateReportName = "TRANSFORMATIONAL CHANGE ASSESSMENT REPORT GENERAL INTERVENTIONS TOOL";
    coverPage.reportDate = new Date().toDateString();
    coverPage.document_prepared_by = 'user';
    coverPage.companyLogoLink =
      'http://localhost:7080/report/cover/icatlogo.jpg';
    return coverPage;

  }

  async saveReport(
    name: string,
    fileName: string,
    countryId: number,
    climateAction: ClimateAction,
    portfolioid:number,
    tool:string,
    type:string
  ) {
    let country = await this.countryRepo
      .createQueryBuilder('country')
      .where('id = :id', { id: countryId })
      .getOne();
    let report = new Report();
    report.reportName = name;
    report.generateReportName = fileName;
    report.savedLocation = './public/' + fileName;
    report.tool = tool;
    report.type = type;
    if(portfolioid&&portfolioid!=0){
      let portfolio=new Portfolio()
      portfolio.id=portfolioid
      report.portfolio = portfolio;
    }
    
    // report.savedLocation = '/home/ubuntu/code/Main/main/public/' + fileName;
    report.thumbnail =
      'https://act.campaign.gov.uk/wp-content/uploads/sites/25/2017/02/form_icon-1.jpg';
    report.country = country;
    if (climateAction.id) {
      report.climateAction = climateAction;
    }
    return await this.repo.save(report);
  }

  async getReports(
    climateAction: string,
    reportName: string,
    countryIdFromTocken: number,
    type: string,
    tool: string
  ) {
    const currentUser = await this.usersService.currentUser();
    let res: Report[] = [];
    if(type){
      if(type=='Result'){
        
        if (!climateAction && !reportName) {
       
          res = await this.repo.find({
            where: {
              type:type,
              country: { id: countryIdFromTocken },
            },
            relations: ['climateAction'],
          });
        } else {
          if(tool){
            res = await this.repo.find({
              where: {
                tool:tool,
                climateAction: { policyName: Like(`%${climateAction}%`) },
                reportName: Like(`%${reportName}%`),
                country: { id: countryIdFromTocken },
              },
            });
          }else{
            res = await this.repo.find({
              where: {
                climateAction: { policyName: Like(`%${climateAction}%`) },
                reportName: Like(`%${reportName}%`),
                country: { id: countryIdFromTocken },
              },
            });
          }
         
        }
    
      }else{
        if (!climateAction && !reportName) {
          res = await this.repo.find({
            where: {
              type:type,
              country: { id: countryIdFromTocken },
            },
            relations: ['portfolio'],
          });
        } else {
          res = await this.repo.find({
            where: {
              portfolio: { portfolioName: Like(`%${reportName}%`) },
              reportName: Like(`%${reportName}%`),
              country: { id: countryIdFromTocken },
            },
          });
        }

      }
    }
    else{
      if (!climateAction && !reportName) {
        res = await this.repo.find({
          where: {
            country: { id: countryIdFromTocken },
          },
          relations: ['climateAction'],
        });
      } else {
        res = await this.repo.find({
          where: {
            climateAction: { policyName: Like(`%${climateAction}%`) },
            reportName: Like(`%${reportName}%`),
            country: { id: countryIdFromTocken },
          },
        });
      }
  
    }

    let reportList: Report[] = [];
    const isUserExternal = currentUser?.userType?.name === 'External';
    for (const x of await res) {
      const isSameUser = x.climateAction?.user?.id === currentUser?.id;
      const isMatchingCountry =
        x.climateAction?.user?.country?.id === currentUser?.country?.id;
      const isUserInternal =
        x.climateAction?.user?.userType?.name !== 'External';
      if (
        (isUserExternal && isSameUser) ||
        (!isUserExternal && isMatchingCountry && isUserInternal)
      ) {
        reportList.push(x);
      }
    }
    return res;
  }

  async genarateReportDtoContentOne(
    assessmentId: number,
    tool:string
  ): Promise<ReportContentOne> {
    const reportContentOne = new ReportContentOne();
    let investorTool = new InvestorTool();
    let isInvestment:boolean = false;
    let asse = await this.assessmentService.findbyIDforReport(assessmentId);
    console.log("assessmentId", assessmentId)
    if(tool=='Investment'){
  
      investorTool = await this.investorToolService.getResultByAssessment(assessmentId)
      isInvestment = true;
      // console.log("investorTool", investorTool,isInvestment)
    }
   
    // reportContentOne.policyName = asse.climateAction.policyName;
    // reportContentOne.assesmentPersonOrOrganization = asse.person;
    // reportContentOne.assessmentYear = asse.year;
    // reportContentOne.intendedAudience = asse.audience;
    reportContentOne.opportunities = asse.opportunities ? asse.opportunities : 'N/A';
    // reportContentOne.objectives = await this.assessmentService.getAssessmentObjectiveforReport(assessmentId);
    reportContentOne.assessmetType = asse.assessmentType ? asse.assessmentType : 'N/A';
    reportContentOne.principles = asse.principles ? asse.principles : 'N/A';
    // reportContentOne.assessmentBoundary = asse.assessBoundry;

    // reportContentOne.impactCoverd = asse.impactsCovered;
    reportContentOne.sectorCoverd = asse.investor_sector && asse.investor_sector.length ? asse.investor_sector
      ?.map((a) => a.sector.name)
      .join(',') : 'N/A';
    reportContentOne.geograpycalCover = asse.geographical_areas_covered && asse.geographical_areas_covered.length ? asse.geographical_areas_covered
      ?.map((a) => a.name)
      .join(',') : 'N/A';;
    reportContentOne.policyOrActionsDetails = [
      {
        information: 'Title of the intervention',
        description: asse.climateAction.policyName ? asse.climateAction.policyName : 'N/A',
      },
      // {
      //   information: 'Type',
      //   description: asse.climateAction.typeofAction ? asse.climateAction.typeofAction : 'N/A',
      // },
      {
        information: 'Description of the intervention',
        description: asse.climateAction.description ? asse.climateAction.description : 'N/A',
      },
      {
        information: 'Status',
        description: asse.climateAction.projectStatus
          ? asse.climateAction.projectStatus.name
          : 'N/A'
      },
      {
        information: 'Date of implementation',
        description: asse.climateAction.dateOfImplementation
          ? new Date(
            asse.climateAction.dateOfImplementation,
          ).toLocaleDateString()
          : 'N/A',
      },
      {
        information: 'Date of completion (if relevant)',
        description: asse.climateAction.dateOfCompletion
          ? new Date(asse.climateAction.dateOfCompletion).toLocaleDateString()
          : 'N/A',
      },
      {
        information: 'Implementing entity or entities',
        description: asse.climateAction.implementingEntity ? asse.climateAction.implementingEntity : 'N/A',
      },
      {
        information: 'Objectives and intended impacts or benefits of the intervention ',
        description: asse.climateAction.objective ? asse.climateAction.objective : 'N/A',
      },
      {
        information: 'Level of the policy or action ',
        description: asse.climateAction.levelofImplemenation ? asse.climateAction.levelofImplemenation : 'N/A',
      },
      {
        information: 'Geographic coverage',
        description: asse.climateAction.geographicCoverage
          ? asse.climateAction.geographicCoverage
          : 'N/A',
      },
      {
        information: 'Sectors covered ',
        description: asse.climateAction.policy_sector
          ? asse.climateAction.policy_sector.map((a) => a.sector.name).join(',')
          : 'N/A',
      },
      {
        information: 'Total investment (in USD)',
        isInvestment: isInvestment,
        description: investorTool.total_investment
          ? investorTool.total_investment
          : 'N/A',
      },
      {
        information: 'Investment instrument(s) used',
        isInvestment: isInvestment,
        description: investorTool.total_investements
          ? investorTool.total_investements
          : 'N/A',
      },
      {
        information: 'Proportion of total investment',
        isInvestment: isInvestment,
        description: investorTool.total_investements
          ? investorTool.total_investements
          : 'N/A',
      },
      {
        information: 'Related interventions ',
        description: asse.climateAction.related_policies
          ? asse.climateAction.related_policies
          : 'N/A',
      },
      {
        information: 'Reference',
        description: asse.climateAction.reference
          ? asse.climateAction.reference
          : 'N/A',
      },
    ];



    reportContentOne.understanPolicyOrActions = [
      // {

      //   Time_periods: 'Description of the vision for desired societal, environmental and technical changes',

      //   description: asse.envisioned_change ? asse.envisioned_change : 'N/A',

      // },

      {

        Time_periods: 'Long-term (≥15 years)',

        description: asse.vision_long ? asse.vision_long : 'N/A',

      },

      {

        Time_periods: 'Medium-term (≥5 years and &lt; than 15 years)',

        description: asse.vision_medium ? asse.vision_medium : 'N/A',

      },

      {

        Time_periods: 'Short-term (&lt; 5 years)',

        description: asse.vision_short ? asse.vision_short : 'N/A',

      },

      {

        Time_periods: 'Phase of transformation',

        description: asse.phase_of_transformation ? asse.phase_of_transformation : 'N/A',

      },

    ];





    // reportContentOne.barriers = [

    //   {

    //     barrier: 'test barrier',

    //     explanation: 'test explanation',

    //     characteristics_affected: 'test characteristics_affected',

    //     barrier_directly_targeted: 'test barrier_directly_targeted',

    //   },

    //   {

    //     barrier: 'test barrier',

    //     explanation: 'test explanation',

    //     characteristics_affected: 'test characteristics_affected',

    //     barrier_directly_targeted: 'test barrier_directly_targeted',

    //   },

    //   {

    //     barrier: 'test barrier',

    //     explanation: 'test explanation',

    //     characteristics_affected: 'test characteristics_affected',

    //     barrier_directly_targeted: 'test barrier_directly_targeted',

    //   },

    // ];

    reportContentOne.barriers = []

    asse.policy_barrier.map(a => {

      reportContentOne.barriers.push({
        barrier: a.barrier ? a.barrier : 'N/A',

        explanation: a.explanation ? a.explanation : 'N/A',

        characteristics_affected: a.barrierCategory ? a.barrierCategory.map(b => b.characteristics.name.replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")).join(',') : 'N/A',

        barrier_directly_targeted: a.is_affected ? 'YES' : 'NO',
      })

    })

    reportContentOne.contextOfPolicy = [];

    let catagoryProcess = [];
    let catagoryOutcome = [];
    reportContentOne.outcomecharacteristics = catagoryOutcome;

    reportContentOne.prossescharacteristics = catagoryProcess;



    return reportContentOne;

  }

  getrelavance(number: number): string {

    switch (number) {

      case 0: {

        return 'Not relevant';
        

      }

      case 1: {

        return 'Possible relevant';

      }

      case 2: {

        return ' Relevant';

      }

    }

  }

  getScore(number: number): string {

    switch (number) {

      case -3: {

        return 'Major';

      }

      case -2: {

        return 'Moderate';

      }

      case -1: {

        return 'Minor';

      }

      case 0: {

        return 'None';

      }

      case 1: {

        return 'Minor Negative';

      }

      case 2: {

        return 'Moderate Negative';

      }

      case 3: {

        return 'Major Negative';

      }

    }

  }

  async genarateReportDtoContentTwo(

    assessmentId: number,
    tool:string

  ): Promise<ReportContentTwo> {

    const reportContentTwo = new ReportContentTwo();
    reportContentTwo.tool = tool;
    let asssIndicatorsProcess =

      await this.assessmentService.getCharacteristicasforReport(

        assessmentId,

        'process',

        '',

        '',

      );

    let catagoryProcess = [];

    let catagoryProcessExAnteAssesment = [];

    if (asssIndicatorsProcess) {

      reportContentTwo.assesmentType = asssIndicatorsProcess.assessmentType;



      for (let invesass of asssIndicatorsProcess.investor_assessment) {
      
        let cat = catagoryProcess.find((a) => a.name == invesass.category.name);

        if (cat) {

          cat.characteristics.push({

            name: invesass.characteristics.name

              ? invesass.characteristics.name

              : '-',

            relavance: invesass.relavance!=null&&invesass.relavance!=undefined

              ? this.getrelavance(invesass.relavance)

              : '-',

              question: invesass.characteristics.main_question
            ? invesass.characteristics.main_question
            : '-',

            likelihoodscore: invesass.likelihood!=null&&invesass.likelihood!=undefined ? invesass.likelihood : '-',
            

            rationalejustifying: invesass.likelihood_justification

              ? invesass.likelihood_justification

              : '-',

            Supportingsdocumentssupplied: '-',

          });

          cat.rows = cat.characteristics.length;

        } else {

          catagoryProcess.push({

            rows: 1,

            name: invesass.category.name,

            characteristics: [

              {

                name: invesass.characteristics.name,

                relavance: invesass.relavance!=null&&invesass.relavance!=undefined

                  ? this.getrelavance(invesass.relavance)

                  : '-',
                  question: invesass.characteristics.main_question
            ? invesass.characteristics.main_question
            : '-',

                likelihoodscore: invesass.likelihood!=null&&invesass.likelihood!=undefined

                  ? invesass.likelihood

                  : '-',

                rationalejustifying: invesass.likelihood_justification

                  ? invesass.likelihood_justification

                  : '-',

                Supportingsdocumentssupplied: '-',

              },

            ],

          });

        }

      }

    }

    let asssCharacteristicasscaleghg =

      await this.assessmentService.getCharacteristicasforReport(

        assessmentId,

        'outcome',

        'SCALE_GHG',

        '',

      );

    let scale_ghg = [];

    if (asssCharacteristicasscaleghg) {

      for (let invesass of asssCharacteristicasscaleghg.investor_assessment) {



        let cat = scale_ghg.find((a) => a.name == invesass.category.name);

        if (cat) {

          cat.characteristics.push({

            name: invesass.characteristics

              ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

              : '-',



            withinboundaries:

            invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'NO'

            : 'YES')

               ,

            score: invesass.score != null && invesass.score != undefined

              ? this.getScore(invesass.score)

              : 'Outside Assessment Boundaries',

            ustifying: invesass.justification ? invesass.justification : '-',

          });

          cat.rows = cat.characteristics.length;

        } else {

          scale_ghg.push({

            rows: 1,

            name: invesass.category.name,

            characteristics: [

              {

                name: invesass.characteristics

                  ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

                  : '-',



                withinboundaries:

                invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'NO'

                : 'YES'),

                score: invesass.score != null && invesass.score != undefined

                  ? this.getScore(invesass.score)

                  : 'Outside Assessment Boundaries',

                ustifying: invesass.justification

                  ? invesass.justification

                  : '-',

              },

            ],

          });

        }

      }

      reportContentTwo.scale_ghg = scale_ghg;

    }



    let asssCharacteristicassustained_ghg =

      await this.assessmentService.getCharacteristicasforReport(

        assessmentId,

        'outcome',

        'SUSTAINED_GHG',

        '',

      );

    let sustained_ghg = [];

    if (asssCharacteristicassustained_ghg) {

      for (let invesass of asssCharacteristicassustained_ghg.investor_assessment) {

        let cat = sustained_ghg.find((a) => a.name == invesass.category.name);

        if (cat) {

          cat.characteristics.push({

            name: invesass.characteristics

              ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

              : '-',



            withinboundaries:invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'NO'

            : 'YES'),

              // invesass.score == null || invesass.score == undefined

              //   ? 'NO'

              //   : 'YES',

            score: invesass.score != null && invesass.score != undefined

              ? this.getScore(invesass.score)

              : 'Outside Assessment Boundaries',

            ustifying: invesass.justification ? invesass.justification : '-',

          });

          cat.rows = cat.characteristics.length;

        } else {

          sustained_ghg.push({

            rows: 1,

            name: invesass.category.name,

            characteristics: [

              {

                name: invesass.characteristics

                  ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

                  : '-',



                withinboundaries:
                invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'NO'

            : 'YES'),

                  // invesass.score == null || invesass.score == undefined

                  //   ? 'NO'

                  //   : 'YES',

                score: invesass.score != null && invesass.score != undefined

                  ? this.getScore(invesass.score)

                  : 'Outside Assessment Boundaries',

                ustifying: invesass.justification

                  ? invesass.justification

                  : '-',

              },

            ],

          });

        }

      }

      reportContentTwo.sustained_ghg = sustained_ghg;

    }



    let asssCharacteristicasscale_adaptation =

      await this.assessmentService.getCharacteristicasforReport(

        assessmentId,

        'outcome',

        'SCALE_ADAPTATION',

        '',

      );

    let scale_adaptation = [];

    if (asssCharacteristicasscale_adaptation) {

      for (let invesass of asssCharacteristicasscale_adaptation.investor_assessment) {

        let cat = scale_adaptation.find((a) => a.name == invesass.category.name);

        if (cat) {

          cat.characteristics.push({

            name: invesass.characteristics

              ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

              : '-',



            withinboundaries:
            invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'NO'

            : 'YES'),

              // invesass.score == null || invesass.score == undefined

              //   ? 'NO'

              //   : 'YES',

            score: invesass.score != null && invesass.score != undefined

              ? this.getScore(invesass.score)

              : 'Outside Assessment Boundaries',

            ustifying: invesass.justification ? invesass.justification : '-',

          });

          cat.rows = cat.characteristics.length;

        } else {

          scale_adaptation.push({

            rows: 1,

            name: invesass.category.name,

            characteristics: [

              {

                name: invesass.characteristics

                  ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

                  : '-',



                withinboundaries:
                invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'NO'

            : 'YES'),

                  // invesass.score == null || invesass.score == undefined

                  //   ? 'NO'

                  //   : 'YES',

                score: invesass.score != null && invesass.score != undefined

                  ? this.getScore(invesass.score)

                  : 'Outside Assessment Boundaries',

                ustifying: invesass.justification

                  ? invesass.justification

                  : '-',

              },

            ],

          });

        }

      }

      reportContentTwo.scale_adaptation = scale_adaptation;

    }







    let asssCharacteristicassustained_adaptation =

      await this.assessmentService.getCharacteristicasforReport(

        assessmentId,

        'outcome',

        'SUSTAINED_ADAPTATION',

        '',

      );

    let sustained_adaptation = [];

    if (asssCharacteristicassustained_adaptation) {

      for (let invesass of asssCharacteristicassustained_adaptation.investor_assessment) {

        let cat = sustained_adaptation.find((a) => a.name == invesass.category.name);

        if (cat) {

          cat.characteristics.push({

            name: invesass.characteristics

              ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

              : '-',



            withinboundaries:
            invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'NO'

            : 'YES'),
              // invesass.score == null || invesass.score == undefined

              //   ? 'NO'

              //   : 'YES',

            score: invesass.score != null && invesass.score != undefined

              ? this.getScore(invesass.score)

              : 'Outside Assessment Boundaries',

            ustifying: invesass.justification ? invesass.justification : '-',

          });

          cat.rows = cat.characteristics.length;

        } else {

          sustained_adaptation.push({

            rows: 1,

            name: invesass.category.name,

            characteristics: [

              {

                name: invesass.characteristics

                  ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

                  : '-',



                withinboundaries:
                invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'NO'

                : 'YES'),

                  // invesass.score == null || invesass.score == undefined

                  //   ? 'NO'

                  //   : 'YES',

                score: invesass.score != null && invesass.score != undefined

                  ? this.getScore(invesass.score)

                  : 'Outside Assessment Boundaries',

                ustifying: invesass.justification

                  ? invesass.justification

                  : '-',

              },

            ],

          });

        }

      }

      reportContentTwo.sustained_adaptation = sustained_adaptation;

    }











    let asssCharacteristicasscalesd =

      await this.assessmentService.getCharacteristicasforReport(

        assessmentId,

        'outcome',

        'SCALE_SD',

        '',

      );



    let scale_sd: { rows: number, name: string, sdg: { rows: number, name: string, impact: string, characteristics: any[] }[] } = { rows: 0, name: '', sdg: [] };





    if (asssCharacteristicasscalesd) {
console.log(asssCharacteristicasscalesd)
      scale_sd.name = 'SDG Scale of the Outcome';
      // reportContentTwo.processScore = asssCharacteristicasscalesd.process_score;
      // reportContentTwo.outcomeScore = asssCharacteristicasscalesd.outcome_score;

      const filterinsass = asssCharacteristicasscalesd.investor_assessment.filter(a => a.portfolioSdg);

      scale_sd.rows = filterinsass.length



      for (let invesass of filterinsass) {





        let cat = scale_sd.sdg.find((a) => a.name == invesass.portfolioSdg.name);

        if (cat) {

          cat.characteristics.push({

            name: invesass.characteristics

              ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

              : '-',



            withinboundaries:
            invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'NO'

            : 'YES'),

              // invesass.score == null || invesass.score == undefined

              //   ? 'NO'

              //   : 'YES',

            score: invesass.score != null && invesass.score != undefined

              ? this.getScore(invesass.score)

              : 'Outside Assessment Boundaries',

            ustifying: invesass.justification ? invesass.justification : '-',

          });

          cat.rows = cat.characteristics.length;

        } else {

          scale_sd.sdg.push({

            rows: 1,

            name: invesass.portfolioSdg.name,

            impact: invesass.portfolioSdg?.sdg_assessment.answer ? invesass.portfolioSdg.sdg_assessment.answer : 'N/A',

            characteristics: [

              {

                name: invesass.characteristics

                  ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

                  : '-',



                withinboundaries:
                invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'NO'

                : 'YES'),

                  // invesass.score == null || invesass.score == undefined

                  //   ? 'NO'

                  //   : 'YES',

                score: invesass.score != null && invesass.score != undefined

                  ? this.getScore(invesass.score)

                  : 'Outside Assessment Boundaries',

                ustifying: invesass.justification

                  ? invesass.justification

                  : '-',

              },

            ],
          }



          )

        }







      }



    }

    reportContentTwo.scale_sd = scale_sd;

    let asssCharacteristicassustainedsd =

      await this.assessmentService.getCharacteristicasforReport(

        assessmentId,

        'outcome',

        'SUSTAINED_SD',

        '',

      );



    let sustained_sd: { rows: number, name: string, sdg: { rows: number, name: string, impact: string, characteristics: any[] }[] } = { rows: 0, name: '', sdg: [] };



    if (asssCharacteristicassustainedsd) {

      sustained_sd.name = 'SDG Time frame over which the outcome is sustained';



      const filterinsasssustained_sd = asssCharacteristicassustainedsd.investor_assessment.filter(a => a.portfolioSdg);

      sustained_sd.rows = filterinsasssustained_sd.length

      for (let invesass of filterinsasssustained_sd) {





        let cat = sustained_sd.sdg.find((a) => a.name == invesass.portfolioSdg.name);

        if (cat) {

          cat.characteristics.push({

            name: invesass.characteristics

              ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

              : '-',



            withinboundaries:
            invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'NO'

            : 'YES'),

              // invesass.score == null || invesass.score == undefined

              //   ? 'NO'

              //   : 'YES',

            score: invesass.score != null && invesass.score != undefined

              ? this.getScore(invesass.score)

              : 'Outside Assessment Boundaries',

            ustifying: invesass.justification ? invesass.justification : '-',

          });

          cat.rows = cat.characteristics.length;

        } else {

          sustained_sd.sdg.push({

            rows: 1,

            name: invesass.portfolioSdg.name,

            impact: invesass.portfolioSdg?.sdg_assessment.answer ? invesass.portfolioSdg.sdg_assessment.answer : 'N/A',

            characteristics: [

              {

                name: invesass.characteristics

                  ? this.mapCharacteristicsnames(invesass.characteristics.name).replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")

                  : '-',



                withinboundaries:
                invesass.score == null || invesass.score == undefined?'N/A':(invesass.score == 99 ? 'NO'

                : 'YES'),

                  // invesass.score == null || invesass.score == undefined

                  //   ? 'NO'

                  //   : 'YES',

                score: invesass.score != null && invesass.score != undefined

                  ? this.getScore(invesass.score)

                  : 'Outside Assessment Boundaries',

                ustifying: invesass.justification

                  ? invesass.justification

                  : '-',

              },

            ],
          }



          )

        }







      }



    }

    reportContentTwo.sustained_sd = sustained_sd;





    let res = await this.investorToolService.calculateNewAssessmentResults(assessmentId);
    // console.log("=============",res.processData)
    // console.log("=============================")

    reportContentTwo.process_categories_assessment = res.processData;
   
    reportContentTwo.outcomes_categories_assessment = res.outcomeData;
    reportContentTwo.processScore = res.processScore;
    reportContentTwo.outcomeScore = res.outcomeScore;
    // console.log("processScore",reportContentTwo.processScore,"outcomeScore",reportContentTwo.outcomeScore)


    // let asssIndicatorOutcome =

    //   await this.assessmentService.getCharacteristicasforReport(

    //     assessmentId,

    //     'outcome',

    //     '',

    //   );

    // let catagoryOutcome = [];

    // let catagoryOutcomeExAnteAssesment = [];

    // if (asssIndicatorsProcess) {

    //   for (let parameter of asssIndicatorOutcome.parameters) {

    //     let cat = catagoryOutcome.find(

    //       (a) => a.name == parameter.category.name,

    //     );

    //     if (cat) {

    //       cat.characteristics.push({

    //         name: parameter.characteristics.name,

    //         indicator: parameter.indicator ? parameter.indicator.name : '-',

    //       });

    //       cat.rows = cat.characteristics.length;

    //     } else {

    //       catagoryOutcome.push({

    //         rows: 1,

    //         name: parameter.category.name,

    //         characteristics: [

    //           {

    //             name: parameter.characteristics.name,

    //             indicator: parameter.indicator ? parameter.indicator.name : '-',

    //           },

    //         ],

    //       });

    //     }

    //   }



    //   for (let parameter of asssIndicatorOutcome.parameters) {

    //     let cat = catagoryOutcomeExAnteAssesment.find(

    //       (a) => a.name == parameter.category.name,

    //     );

    //     if (cat) {

    //       cat.characteristics.push({

    //         name: parameter.characteristics.name,

    //         score: parameter.score,

    //         justifying_score: parameter.scoreOrInstitutionJusti,

    //         indicator: parameter.indicator ? parameter.indicator.name : '-',

    //         indicator_starting_value: '-',

    //         indicator_value: parameter.indicatorValue,

    //       });

    //       cat.rows = cat.characteristics.length;

    //     } else {

    //       catagoryOutcomeExAnteAssesment.push({

    //         rows: 1,

    //         name: parameter.category.name,

    //         characteristics: [

    //           {

    //             name: parameter.characteristics.name,

    //             score: parameter.score,

    //             justifying_score: parameter.scoreOrInstitutionJusti,

    //             indicator: parameter.indicator ? parameter.indicator.name : '-',

    //             indicator_value: parameter.indicatorValue,

    //           },

    //         ],

    //       });

    //     }

    //   }

    // }



    reportContentTwo.prossesAssesmentStartingSituation1 = catagoryProcess.slice(0,catagoryProcess.length/2);
    reportContentTwo.prossesAssesmentStartingSituation2 = catagoryProcess.slice(catagoryProcess.length/2,catagoryProcess.length);
    // reportContentTwo.outcomeAssesmentStartingSituation = catagoryOutcome;

    reportContentTwo.prossesExAnteAssesment = catagoryProcessExAnteAssesment;

    // reportContentTwo.outcomeExAnteAssesment = catagoryOutcomeExAnteAssesment;



    // let asssResulrProcess =

    //   await this.assessmentService.getCharacteristicasforReport(

    //     assessmentId,

    //     'process',

    //     '',

    //   );

    // let prossesDescribeResult = [];

    // if (asssResulrProcess) {

    //   for (let parameter of asssResulrProcess.parameters) {

    //     let cat = prossesDescribeResult.find(

    //       (a) => a.name == parameter.category.name,

    //     );

    //     if (cat) {

    //       (cat.score = parameter.score),

    //         (cat.justifying_score = parameter.scoreOrInstitutionJusti),

    //         (cat.relative_importance = '');

    //     } else {

    //       prossesDescribeResult.push({

    //         name: parameter.category.name,

    //         score: parameter.score,

    //         justifying_score: parameter.scoreOrInstitutionJusti,

    //         relative_importance: '',

    //       });

    //     }

    //   }

    // }



    // let asssResultOutcome = await this.assessmentService.getResultforReport(

    //   assessmentId,

    //   'outcome',

    //   '',

    // );

    // let outcomeDescribeResult = [];

    // if (asssResultOutcome) {

    //   for (let parameter of asssResultOutcome.parameters) {

    //     console.log(parameter);

    //     let cat = outcomeDescribeResult.find(

    //       (a) => a.name == parameter.category.name,

    //     );

    //     if (cat) {

    //       (cat.score = parameter.score),

    //         (cat.justifying_score = parameter.scoreOrInstitutionJusti),

    //         (cat.relative_importance = '');

    //     } else {

    //       outcomeDescribeResult.push({

    //         name: parameter.category.name,

    //         score: parameter.score,

    //         justifying_score: parameter.scoreOrInstitutionJusti,

    //         relative_importance: '',

    //       });

    //     }

    //   }

    // }



    // reportContentTwo.prossesDescribeResult = prossesDescribeResult;

    // reportContentTwo.outcomeDescribeResult = outcomeDescribeResult;

    return reportContentTwo;

  }



  async genarateReportCarbonMarketDto(
    createReportDto: CreateReportDto,
  ): Promise<ReportCarbonMarketDto> {
    const reportCarbonMarketDto = new ReportCarbonMarketDto();
    reportCarbonMarketDto.reportName = createReportDto.reportName;
    reportCarbonMarketDto.coverPage = this.genarateReportCarbonMarketDtoCoverPage(
      createReportDto.reportTitle,
    );
    reportCarbonMarketDto.contentOne = await this.genarateReportCarbonMarketDtoContentOne(
      createReportDto.assessmentId,
    );
    reportCarbonMarketDto.contentTwo = await this.genarateReportCarbonMarketDtoContentTwo(
      createReportDto.assessmentId,
    );
    reportCarbonMarketDto.contentThree = await this.genarateReportCarbonMarketDtoContentThree(
      createReportDto.assessmentId,
    );
    reportCarbonMarketDto.contentFour = await this.genarateReportCarbonMarketDtoContentFour(
      createReportDto.assessmentId,
    );
    reportCarbonMarketDto.contentFive = await this.genarateReportCarbonMarketDtoContentFive(
      createReportDto.assessmentId,
    );
  
    return reportCarbonMarketDto;
  }
  
  genarateReportCarbonMarketDtoCoverPage(
    title:string
  ): ReportCarbonMarketDtoCoverPage{
    const coverPage=new ReportCarbonMarketDtoCoverPage()
   
    // coverPage.generateReportName = title;
    coverPage.generateReportName = 'TRANSFORMATIONAL CHANGE ASSESSMENT REPORT  CARBON MARKETS TOOL';
    coverPage.reportDate = new Date().toDateString();
    coverPage.document_prepared_by = 'user';
    coverPage.companyLogoLink =
      'http://localhost:7080/report/cover/icatlogo.jpg';
    return coverPage;


  }
 async genarateReportCarbonMarketDtoContentOne(
    assessmentId:number
  ):Promise<ReportCarbonMarketDtoContentOne>{
    const contentOne=new ReportCarbonMarketDtoContentOne()
    let asse = await this.assessmentService.findbyIDforCarbonMarketReport(assessmentId);
    console.log("assessmentId", assessmentId)
   
    // contentOne.opportunities = asse.opportunities ? asse.opportunities : 'N/A';
    // // reportContentOne.objectives = await this.assessmentService.getAssessmentObjectiveforReport(assessmentId);
    // reportContentOne.assessmetType = asse.assessmentType ? asse.assessmentType : 'N/A';
    // reportContentOne.principles = asse.principles ? asse.principles : 'N/A';
    // // reportContentOne.assessmentBoundary = asse.assessBoundry;
// console.log("sectors",asse.climateAction.policy_sector)
    // reportContentOne.impactCoverd = asse.impactsCovered;
    // reportContentOne.sectorCoverd = asse.investor_sector && asse.investor_sector.length ? asse.investor_sector
    //   ?.map((a) => a.sector.name)
    //   .join(',') : 'N/A';
    // reportContentOne.geograpycalCover = asse.geographical_areas_covered && asse.geographical_areas_covered.length ? asse.geographical_areas_covered
    //   ?.map((a) => a.name)
    //   .join(',') : 'N/A';;
    contentOne.policyOrActionsDetails = [
      {
        information: 'Title of the intervention',
        description: asse.climateAction.policyName ? asse.climateAction.policyName : 'N/A',
      },
      // {
      //   information: 'Type',
      //   description: asse.climateAction.typeofAction ? asse.climateAction.typeofAction : 'N/A',
      // },
      {
        information: 'Description of the intervention',
        description: asse.climateAction.description ? asse.climateAction.description : 'N/A',
      },
      // {
      //   information: 'Status',
      //   description: asse.climateAction.projectStatus
      //     ? asse.climateAction.projectStatus.name
      //     : 'N/A'
      // },
      {
        information: 'Date of implementation',
        description: asse.climateAction.dateOfImplementation
          ? new Date(
            asse.climateAction.dateOfImplementation,
          ).toLocaleDateString()
          : 'N/A',
      },
      {
        information: 'Date of completion (if relevant)',
        description: asse.climateAction.dateOfCompletion
          ? new Date(asse.climateAction.dateOfCompletion).toLocaleDateString()
          : 'N/A',
      },
      {
        information: 'Implementing entity or entities',
        description: asse.climateAction.implementingEntity ? asse.climateAction.implementingEntity : 'N/A',
      },
      {
        information: 'Objectives and intended impacts or benefits of the intervention ',
        description: asse.climateAction.objective ? asse.climateAction.objective : 'N/A',
      },
      {
        information: 'Level of the policy or action ',
        description: asse.climateAction.levelofImplemenation ? asse.climateAction.levelofImplemenation : 'N/A',
      },
      {
        information: 'Geographic coverage',
        description: asse.climateAction.geographicCoverage
          ? asse.climateAction.geographicCoverage
          : 'N/A',
      },
      {
        information: 'Sectors covered ',
        description: asse.climateAction.policy_sector
          ? asse.climateAction.policy_sector.map((a) => a.sector.name).join(',')
          : 'N/A',
      },
      {
        information: 'Related interventions ',
        description: asse.climateAction.related_policies
          ? asse.climateAction.related_policies
          : 'N/A',
      },
      {
        information: 'Reference',
        description: asse.climateAction.reference
          ? asse.climateAction.reference
          : 'N/A',
      },
    ];

    //table 1.2
   console.log("sm assesment", asse.cmAssementDetails)
    contentOne.characteristics = [
      {
        information: 'Selection of the activity',
        description: asse.climateAction.policyName
      },
      {
        information: 'Scale of the activity',
        description: asse.cmAssementDetails.scale
      },
      {
        information: 'Assessment boundaries',
        description: asse.cmAssementDetails.boundraries
      },
      {
        information: 'International carbon market approach used ',
        description: asse.cmAssementDetails.intCMApproach
      },
      {
        information: 'Baseline and monitoring methodology applied by the activity ',
        description: asse.cmAssementDetails.appliedMethodology
      },
    ]

    contentOne.transformational = [
    

      {

        information: 'Long-term (≥15 years)',

        description: asse.vision_long ? asse.vision_long : 'N/A',

      },

      {

        information: 'Medium-term (≥5 years and &lt; than 15 years)',

        description: asse.vision_medium ? asse.vision_medium : 'N/A',

      },

      {

        information: 'Short-term (&lt; 5 years)',

        description: asse.vision_short ? asse.vision_short : 'N/A',

      },

      {

        information: 'Phase of transformation',

        description: asse.phase_of_transformation ? asse.phase_of_transformation : 'N/A',

      },

    ];
    contentOne.barriers = []

    asse.policy_barrier.map(a => {

      contentOne.barriers.push({
        barrier: a.barrier ? a.barrier : 'N/A',

        explanation: a.explanation ? a.explanation : 'N/A',

        characteristics_affected: a.barrierCategory ? a.barrierCategory.map(b => b.characteristics.name.replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")).join(',') : 'N/A',

        barrier_directly_targeted: a.is_affected ? 'YES' : 'NO',
      })

    })
    //table 1.4
    contentOne.assessmetType = asse.assessmentType;
    contentOne.geograpycalCover = asse.geographical_areas_covered.map(a=>a.name).join('')
    // console.log("asse.investor_sector",asse.investor_sector)
    contentOne.sectorCoverd = asse.investor_sector.map(a=>a.sector.name).join('')

    // reportContentOne.contextOfPolicy = [];

    // let catagoryProcess = [];
    // let catagoryOutcome = [];
    // reportContentOne.outcomecharacteristics = catagoryOutcome;

    // reportContentOne.prossescharacteristics = catagoryProcess;


return contentOne
  }
  async genarateReportCarbonMarketDtoContentTwo(
    assessmentId:number
  ):Promise<ReportCarbonMarketDtoContentTwo>{
    const contentTwo=new ReportCarbonMarketDtoContentTwo()


return contentTwo
  }
  async genarateReportCarbonMarketDtoContentThree(
    assessmentId:number
  ):Promise<ReportCarbonMarketDtoContentThree>{
    const contentThree=new ReportCarbonMarketDtoContentThree()


return contentThree
  }
  async genarateReportCarbonMarketDtoContentFour(
    assessmentId:number
  ):Promise<ReportCarbonMarketDtoContentFour>{
    const contentFour=new ReportCarbonMarketDtoContentFour()


return contentFour
  }
  async genarateReportCarbonMarketDtoContentFive(
    assessmentId:number
  ):Promise<ReportCarbonMarketDtoContentFive>{
    const contentFive=new ReportCarbonMarketDtoContentFive()


return contentFive
  }














  genarateAssessmentDto(): AssessmentDto {

    return new AssessmentDto();

  }









  async genarateComparisonReportDto(

    createReportDto: CreateComparisonReportDto,

  ): Promise<ComparisonReportDto> {

    const comparisonReportDto = new ComparisonReportDto();
    comparisonReportDto.reportName = createReportDto.reportName;
    comparisonReportDto.coverPage = this.genarateComparisonReportDtoCoverPage(
      createReportDto.reportTitle,
    );
    comparisonReportDto.contentOne = await this.genarateComparisonReportDtoContentOne(createReportDto.portfolioId);


    let result: ComparisonTableDataDto = await this.portfolioService.getPortfolioComparisonData(createReportDto.portfolioId);



    comparisonReportDto.contentTwo = await this.genarateComparisonReportDtoContentTwo(result.process_data, result.outcome_data
    );
    comparisonReportDto.contentThree = await this.genarateComparisonReportDtoContentThree(result.aggregation_data
    );
    comparisonReportDto.contentFour = await this.genarateComparisonReportDtoContentFour(result.alignment_data
    );
    comparisonReportDto.coverPage = this.genarateComparisonReportDtoCoverPage(createReportDto.reportTitle,);

    return comparisonReportDto;

  }





  genarateComparisonReportDtoCoverPage(title: string): ReportCoverPage {

    const coverPage = new ComparisonReportReportCoverPage();

    coverPage.generateReportName = title;

    coverPage.reportDate = new Date().toDateString();

    coverPage.document_prepared_by = 'user';

    coverPage.companyLogoLink =

      'http://localhost:7080/report/cover/icatlogo.jpg';
      

    return coverPage;

  }

  async genarateComparisonReportDtoContentOne(portfolioId: number): Promise<ComparisonReportReportContentOne> {
    let portfolio = new Portfolio();
    let assesment: PortfolioAssessment[] = []
    portfolio = await this.portfolioRepo.findOne({ where: { id: portfolioId } });
    assesment = await this.portfolioAssessRepo.find({
      relations: ['assessment'], where: { portfolio: { id: portfolioId } },
    });
    const contentOne = new ComparisonReportReportContentOne();

    for (let ass of assesment) {
     contentOne.intervation_details.push(
      {
        id: ass.assessment.climateAction.intervention_id,
        name: ass.assessment.climateAction.policyName,
        assesmentType: ass.assessment.assessmentType,
        assesmentPeriodfrom: ass.assessment.from,
        assesmentPeriodto: ass.assessment.to,
      }
     ) 
    }

      contentOne.portfolio_details = [
        {
          information: 'Portfolio ID',
          description: portfolio.portfolioId ? portfolio.portfolioId : 'N/A',
        },
        {
          information: 'Name',
          description: portfolio.portfolioName ? portfolio.portfolioName : 'N/A',
        },
        {
          information: 'Description of the Portfolio',
          description: portfolio.description ? portfolio.description : 'N/A',
        },
        {
          information: 'Date',
          description: portfolio.date ? portfolio.date : 'N/A',
        },
        {
          information: 'Implementing entity or entities',
          description: portfolio.person ? portfolio.person : 'N/A',
        },
        {
          information: 'Objectives of the assessment',
          description: portfolio.objectives ? portfolio.objectives : 'N/A',
        },
        {
          information: 'Intended audience(s) of the assessment',
          description: portfolio.audience ? portfolio.audience : 'N/A',
        },
        {
          information: 'Previous assessments the present assessment is an update of',
          description: portfolio.IsPreviousAssessment == 'Yes' ? portfolio.link : 'N/A',
        },
      ]


      return contentOne;
    }
    genarateComparisonReportDtoContentTwo(process_data: ComparisonDto[], outcome_data: ComparisonDto[]): ComparisonReportReportContentTwo {
      const contentTwo = new ComparisonReportReportContentTwo();


      const tech = process_data.find(a => a.col_set_1.some(b => b.label == 'CATEGORY - TECHNOLOGY'));

      if (tech) {
        contentTwo.prosses_tech = tech.interventions;
        // tech.interventions.forEach(a=>{
        //   contentTwo.prosses_tech.push({ id:a.id,name:a.name,type:a.type,status:a.status,randd:a['R_&_D'],adoptation:a.ADOPTION,scaleup:a.SCALE_UP,score:a.category_score})
        // })

      }

      const agent = process_data.find(a => a.col_set_1.some(b => b.label == 'CATEGORY - AGENTS'));

      if (agent) {
        contentTwo.prosses_agent = agent.interventions;
        //   agent.interventions.forEach(a=>{
        //   contentTwo.prosses_agent.push({ id:a.id,name:a.name,type:a.type,status:a.status,entrepreneurs:a.ENTREPRENEURS,coalition :a.COALITION_OF_ADVOCATES,beneficiaries:a.BENIFICIARIES,score:a.category_score})
        // })

      }
      const incen = process_data.find(a => a.col_set_1.some(b => b.label == 'CATEGORY - INCENTIVES'));

      if (incen) {
        contentTwo.prosses_incentive = incen.interventions;
    
        //   incen.interventions.forEach(a=>{
        //   contentTwo.prosses_incentive.push({ id:a.id,name:a.name,type:a.type,status:a.status,economic :a.ECONOMIC_NON_ECONOMIC,disincentives:a.DISINCENTIVES,institutional :a.INSTITUTIONAL_AND_REGULATORY,score:a.category_score})
        // })

      }
      const norm = process_data.find(a => a.col_set_1.some(b => b.label == 'CATEGORY - NORMS AND BEHAVIORAL CHANGE'));

      if (norm) {
        contentTwo.prosses_norms = norm.interventions;
        //   norm.interventions.forEach(a=>{
        //   contentTwo.prosses_norms.push({ id:a.id,name:a.name,type:a.type,status:a.status,awareness:a.AWARENESS,behavior:a.BEHAVIOUR,norms:a.SOCIAL_NORMS,score:a.category_score})
        // })

      }

      const process_score = process_data.find(a => a.col_set_1.length > 2);

      if (process_score) {
        contentTwo.process_score = process_score.interventions
        //   norm.interventions.forEach(a=>{
        //   contentTwo.prosses_norms.push({ id:a.id,name:a.name,type:a.type,status:a.status,awareness:a.AWARENESS,behavior:a.BEHAVIOUR,norms:a.SOCIAL_NORMS,score:a.category_score})
        // })

      }


      // outcome_data.forEach(a=>console.log(a.interventions))
      const ghg_scale = outcome_data.find(a => a.col_set_1.some(b => b.label == 'GHG') && a.comparison_type == 'SCALE COMPARISON');
      if (ghg_scale) {
        // console.log(ghg_scale)
        contentTwo.ghg_scale = ghg_scale.interventions;
      }

      const ghg_sustaind = outcome_data.find(a => a.col_set_1.some(b => b.label == 'GHG' && a.comparison_type == 'SUSTAINED IN TIME COMPARISON'));
      if (ghg_sustaind) {
        contentTwo.ghg_sustaind = ghg_sustaind.interventions;
      }

      const ghg_scale_sustaind_comparison = outcome_data.find(a => a.comparison_type_2 == 'GHG OUTCOMES' && a.comparison_type == 'SCALE & SUSTAINED IN TIME COMPARISON');
      if (ghg_scale_sustaind_comparison) {

        contentTwo.ghg_scale_sustaind_comparison = ghg_scale_sustaind_comparison.interventions;
        // console.log(contentTwo.ghg_scale_sustaind_comparison)
      }

      const adaptation_scale = outcome_data.find(a => a.col_set_1.some(b => b.label == 'ADAPTATION') && a.comparison_type == 'SCALE COMPARISON');
      if (adaptation_scale) {
        contentTwo.adaptation_scale = adaptation_scale.interventions;
      }

      const adaptation_sustaind = outcome_data.find(a => a.col_set_1.some(b => b.label == 'ADAPTATION') && a.comparison_type == 'SUSTAINED IN TIME COMPARISON');
      if (adaptation_sustaind) {
        contentTwo.adaptation_sustaind = adaptation_sustaind.interventions;
      }

      const adaptation_scale_sustaind_comparison = outcome_data.find(a => a.comparison_type_2 == 'ADAPTATION OUTCOMES' && a.comparison_type == 'SCALE & SUSTAINED IN TIME COMPARISON');
      if (adaptation_scale_sustaind_comparison) {
        contentTwo.adaptation_scale_sustaind_comparison = adaptation_scale_sustaind_comparison.interventions;
      }

      outcome_data.filter(a => a.col_set_1.some(b => b.label.includes('SDG')) && a.col_set_1.length < 3).forEach(c => {

        // console.log('outcome_data',c)
        let sdg = contentTwo.allsdg.find(d => d.sdg_name == c.col_set_1[1].label.slice(c.col_set_1[1].label.indexOf('-') + 1).trim());

        if (sdg) {
          if (c.comparison_type == 'SCALE COMPARISON') {
            sdg.sdg_scale = c.interventions;
          }
          if (c.comparison_type == 'SUSTAINED IN TIME COMPARISON') {
            sdg.sdg_sustaind = c.interventions;
          }
        } else {

          if (c.comparison_type == 'SCALE COMPARISON') {

            contentTwo.allsdg.push({
              sdg_name: c.col_set_1[1].label.slice(c.col_set_1[1].label.indexOf('-') + 1).trim(),
              sdg_scale: c.interventions,
              sdg_sustaind: []
            })
          }
          if (c.comparison_type == 'SUSTAINED IN TIME COMPARISON') {

            contentTwo.allsdg.push({
              sdg_name: c.col_set_1[1].label.slice(c.col_set_1[1].label.indexOf('-') + 1).trim(),
              sdg_scale: [],
              sdg_sustaind: c.interventions
            })
          }


        }

      });
      outcome_data.filter(a => a.comparison_type == 'SCALE & SUSTAINED IN TIME COMPARISON' && a.comparison_type_2.includes('SDG')).forEach(c => {
        contentTwo.sdg_scale_sustaind_comparison.push({sdg_name:c.comparison_type_2,data:c.interventions})

      })

      const sacle_comparison = outcome_data.find(a => a.col_set_1.length > 2 && a.comparison_type == 'SCALE COMPARISON');
      if (sacle_comparison) {
        // console.log(sacle_comparison)
        contentTwo.sacle_comparison = sacle_comparison.interventions;
      }
      const sustaind_comparison = outcome_data.find(a => a.comparison_type == 'SUSTAINED COMPARISON' && a.col_set_1.length > 2);
      if (sustaind_comparison) {
        // console.log(sustaind_comparison)
        contentTwo.sustaind_comparison = sustaind_comparison.interventions;
      }
      const outcome_level = outcome_data.find(a => a.comparison_type == 'OUTCOME LEVEL COMPARISON');
      if (outcome_level) {
        console.log('outcome_level',outcome_level.interventions)
        contentTwo.outcome_level = outcome_level.interventions;
      }

      //  console.log(contentTwo)


      return contentTwo;
    }


    genarateComparisonReportDtoContentThree(aggregation_data: ComparisonDto): ComparisonReportReportContentThree {
      const content = new ComparisonReportReportContentThree();

      content.aggregation = { total: aggregation_data.total, data: aggregation_data.interventions }
      return content;
    }
    genarateComparisonReportDtoContentFour(alignment_data: ComparisonDto): ComparisonReportReportContentFour {
      const contentOne = new ComparisonReportReportContentFour();
      contentOne.alignment_table = alignment_data
      // console.log(alignment_data)
      return contentOne;

    }
    mapCharacteristicsnames(name: string) {
      // console.log(name)
      if(name=='International/global level'){
        return 'Macro level'
      }
      else if(name=='National/Sectorial level'){
        return 'Medium level '
      }
      else if(name=='Subnational/regional/municipal or sub sectorial level'){
        return 'Micro level '
      }
      else{
        return name
      }
    }

  }


