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

@Injectable()
export class ReportService extends TypeOrmCrudService<Report> {
  constructor(
    @InjectRepository(Report) repo,
    @InjectRepository(Country) private countryRepo: Repository<Country>,
    private usersService: UsersService,
    public assessmentService: AssessmentService,
    private readonly investorToolService: InvestorToolService
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
      createReportDto.reportTitle,
    );
    reportDto.contentOne = await this.genarateReportDtoContentOne(
      createReportDto.assessmentId,
    );
    reportDto.contentTwo = await this.genarateReportDtoContentTwo(
      createReportDto.assessmentId,
    );

    return reportDto;
  }

  genarateReportDtoCoverPage(title: string): ReportCoverPage {
    const coverPage = new ReportCoverPage();
    coverPage.generateReportName = title;
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
  ) {
    let country = await this.countryRepo
      .createQueryBuilder('country')
      .where('id = :id', { id: countryId })
      .getOne();
    let report = new Report();
    report.reportName = name;
    report.generateReportName = fileName;
    report.savedLocation = './public/' + fileName;
    // report.savedLocation = '/home/ubuntu/code/Main/main/public/' + fileName;
    report.thumbnail =
      'https://act.campaign.gov.uk/wp-content/uploads/sites/25/2017/02/form_icon-1.jpg';
    report.country = country;
    if(climateAction.id){
      report.climateAction = climateAction;
    }
   
    return await this.repo.save(report);
  }

  async getReports(
    climateAction: string,
    reportName: string,
    countryIdFromTocken: number,
  ) {
    const currentUser = await this.usersService.currentUser();
    let res: Report[] = [];
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
  ): Promise<ReportContentOne> {
    const reportContentOne = new ReportContentOne();
    let asse = await this.assessmentService.findbyIDforReport(assessmentId);
    console.log("assessmentId",assessmentId)
   

    // reportContentOne.policyName = asse.climateAction.policyName;
    // reportContentOne.assesmentPersonOrOrganization = asse.person;
    // reportContentOne.assessmentYear = asse.year;
    // reportContentOne.intendedAudience = asse.audience;
    reportContentOne.opportunities = asse.opportunities?asse.opportunities:'N/A';
    // reportContentOne.objectives = await this.assessmentService.getAssessmentObjectiveforReport(assessmentId);
    reportContentOne.assessmetType = asse.assessmentType?asse.assessmentType:'N/A';
    reportContentOne.principles = asse.principles? asse.principles:'N/A';
    // reportContentOne.assessmentBoundary = asse.assessBoundry;
    // reportContentOne.impactCoverd = asse.impactsCovered;
    reportContentOne.sectorCoverd = asse.investor_sector&&asse.investor_sector.length?asse.investor_sector
      ?.map((a) => a.sector.name)
      .join(','): 'N/A';
    reportContentOne.geograpycalCover =asse.geographical_areas_covered&&asse.geographical_areas_covered.length?asse.geographical_areas_covered
    ?.map((a) => a.name)
    .join(','): 'N/A';;
    reportContentOne.policyOrActionsDetails = [
      {
        information: 'Name',
        description: asse.climateAction.policyName?asse.climateAction.policyName: 'N/A',
      },
      {
        information: 'Type',
        description: asse.climateAction.typeofAction?asse.climateAction.typeofAction: 'N/A',
      },
      {
        information: 'Description',
        description: asse.climateAction.description?asse.climateAction.description: 'N/A',
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
        description: asse.climateAction.implementingEntity? asse.climateAction.implementingEntity:'N/A',
      },
      {
        information: 'Objectives and benefits ',
        description: asse.climateAction.objective?asse.climateAction.objective:'N/A',
      },
      {
        information: 'Level of the policy ',
        description: asse.climateAction.levelofImplemenation?asse.climateAction.levelofImplemenation:'N/A',
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
        information: 'Other related policies ',
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
      
      {
        Time_periods: 'Description of the vision for desired societal, environmental and technical changes',
        description: asse.envisioned_change?asse.envisioned_change :'N/A',
      },
      {
        Time_periods: 'Long-term (≥15 years)',
        description: asse.vision_long?asse.vision_long :'N/A',
      },
      {
        Time_periods: 'Medium-term (≥5 years and &lt; than 15 years)',
        description: asse.vision_medium?asse.vision_medium :'N/A',
      },
      {
        Time_periods: 'Short-term (&lt; 5 years)',
        description: asse.vision_short?asse.vision_short :'N/A',
      },
      {
        Time_periods: 'Phase of transformation',
        description: asse.phase_of_transformation?asse.phase_of_transformation :'N/A',
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
    reportContentOne.barriers=[]
    asse.policy_barrier.map(a=>{
      reportContentOne.barriers.push({  barrier: a.barrier?a.barrier:'N/A',
      explanation: a.explanation?a.explanation:'N/A',
      characteristics_affected: a.barrierCategory?a.barrierCategory.map(b=>b.characteristics.name.replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")).join(','):'N/A',
      barrier_directly_targeted: a.is_affected?'YES':'NO',})
    })
    reportContentOne.contextOfPolicy = [];

    // let asssCharacProcess =
    //   await this.assessmentService.getCharacteristicasforReport(
    //     assessmentId,
    //     'process',
    //     '',
    //   );
    let catagoryProcess = [];
    // if (asssCharacProcess) {
    //   for (let parameter of asssCharacProcess.parameters) {
    //     let cat = catagoryProcess.find(
    //       (a) => a.name == parameter.category.name,
    //     );
    //     if (cat) {
    //       cat.characteristics.push({
    //         name: parameter.characteristics.name,
    //         relevance: parameter.relevance,
    //         comment: parameter.scoreOrInstitutionJusti,
    //       });
    //       cat.rows = cat.characteristics.length;
    //     } else {
    //       catagoryProcess.push({
    //         rows: 1,
    //         name: parameter.category.name,
    //         characteristics: [
    //           {
    //             name: parameter.characteristics.name,
    //             relevance: parameter.relevance,
    //             comment: parameter.scoreOrInstitutionJusti,
    //           },
    //         ],
    //       });
    //     }
    //   }
    // }

    // let asssCharacOutcome =
    //   await this.assessmentService.getCharacteristicasforReport(
    //     assessmentId,
    //     'outcome',
    //     '',
    //   );
    let catagoryOutcome = [];
    // if (asssCharacOutcome) {
    //   for (let parameter of asssCharacOutcome.parameters) {
    //     let cat = catagoryOutcome.find(
    //       (a) => a.name == parameter.category.name,
    //     );
    //     if (cat) {
    //       cat.characteristics.push({
    //         name: parameter.characteristics.name,
    //         relevance: parameter.relevance,
    //         comment: parameter.scoreOrInstitutionJusti,
    //       });
    //       cat.rows = cat.characteristics.length;
    //     } else {
    //       catagoryOutcome.push({
    //         rows: 1,
    //         name: parameter.category.name,
    //         characteristics: [
    //           {
    //             name: parameter.characteristics.name,
    //             relevance: parameter.relevance,
    //             comment: parameter.scoreOrInstitutionJusti,
    //           },
    //         ],
    //       });
    //     }
    //   }
    // }
    reportContentOne.outcomecharacteristics = catagoryOutcome;
    reportContentOne.prossescharacteristics = catagoryProcess;

    return reportContentOne;
  }
  getrelavance(number: number): string {
    switch (number) {
      case 0: {
        return 'relevant';
      }
      case 1: {
        return 'possible_relevant';
      }
      case 2: {
        return 'not_relevant';
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
  ): Promise<ReportContentTwo> {
    const reportContentTwo = new ReportContentTwo();
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
            relavance: invesass.relavance
              ? this.getrelavance(invesass.relavance)
              : '-',
            likelihoodscore: invesass.likelihood ? invesass.likelihood : '-',
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
                relavance: invesass.relavance
                  ? this.getrelavance(invesass.relavance)
                  : '-',
                likelihoodscore: invesass.likelihood
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
              ? invesass.characteristics.name.replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")
              : '-',

            withinboundaries:
              invesass.score == null || invesass.score == undefined
                ? 'NO'
                : 'YES',
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
                  ? invesass.characteristics.name.replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")
                  : '-',

                withinboundaries:
                  invesass.score == null || invesass.score == undefined
                    ? 'NO'
                    : 'YES',
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
            ? invesass.characteristics.name.replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")
            : '-',

          withinboundaries:
            invesass.score == null || invesass.score == undefined
              ? 'NO'
              : 'YES',
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
                ? invesass.characteristics.name.replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")
                : '-',

              withinboundaries:
                invesass.score == null || invesass.score == undefined
                  ? 'NO'
                  : 'YES',
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
          ? invesass.characteristics.name.replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")
          : '-',

        withinboundaries:
          invesass.score == null || invesass.score == undefined
            ? 'NO'
            : 'YES',
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
              ? invesass.characteristics.name.replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")
              : '-',

            withinboundaries:
              invesass.score == null || invesass.score == undefined
                ? 'NO'
                : 'YES',
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
        ? invesass.characteristics.name.replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")
        : '-',

      withinboundaries:
        invesass.score == null || invesass.score == undefined
          ? 'NO'
          : 'YES',
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
            ? invesass.characteristics.name.replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")
            : '-',

          withinboundaries:
            invesass.score == null || invesass.score == undefined
              ? 'NO'
              : 'YES',
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
    
  let scale_sd:{rows:number,name:string,sdg:{rows:number,name:string,impact:string,characteristics:any[]}[]}={rows:0,name:'',sdg:[]};
  
  
  if (asssCharacteristicasscaleghg) {
    scale_sd.name='SDG Scale of the Outcome';
    const filterinsass=asssCharacteristicasscalesd.investor_assessment.filter(a=>a.portfolioSdg);
    scale_sd.rows=filterinsass.length
    
    for (let invesass of filterinsass) {
     

        let cat = scale_sd.sdg.find((a) => a.name == invesass.portfolioSdg.name);
        if (cat) {
          cat.characteristics.push({
            name: invesass.characteristics
              ? invesass.characteristics.name.replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")
              : '-',
  
            withinboundaries:
              invesass.score == null || invesass.score == undefined
                ? 'NO'
                : 'YES',
            score: invesass.score != null && invesass.score != undefined
              ? this.getScore(invesass.score)
              : 'Outside Assessment Boundaries',
            ustifying: invesass.justification ? invesass.justification : '-',
          });
          cat.rows = cat.characteristics.length;
        } else {
          scale_sd.sdg.push({
              rows: 1,
              name:invesass.portfolioSdg.name,
              impact:invesass.portfolioSdg?.sdg_assessment.answer?invesass.portfolioSdg.sdg_assessment.answer:'N/A',
              characteristics: [
                {
                  name: invesass.characteristics
                    ? invesass.characteristics.name.replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")
                    : '-',
                  
                  withinboundaries:
                    invesass.score == null || invesass.score == undefined
                      ? 'NO'
                      : 'YES',
                  score: invesass.score != null && invesass.score != undefined
                    ? this.getScore(invesass.score)
                    : 'Outside Assessment Boundaries',
                  ustifying: invesass.justification
                    ? invesass.justification
                    : '-',
                },
              ],}
  
          ) 
        }

      
    
    }
   
  }
  reportContentTwo.scale_sd = scale_sd;
  let asssCharacteristicassustainedsd=
  await this.assessmentService.getCharacteristicasforReport(
    assessmentId,
    'outcome',
    'SUSTAINED_SD',
    '',
  );
 
let sustained_sd:{rows:number,name:string,sdg:{rows:number,name:string,impact:string,characteristics:any[]}[]}={rows:0,name:'',sdg:[]};

if (asssCharacteristicassustainedsd) {
  sustained_sd.name='SDG Time frame over which the outcome is sustained';
 
  const filterinsasssustained_sd=asssCharacteristicassustainedsd.investor_assessment.filter(a=>a.portfolioSdg);
  sustained_sd.rows=filterinsasssustained_sd.length
  for (let invesass of filterinsasssustained_sd) {
   

      let cat = sustained_sd.sdg.find((a) => a.name == invesass.portfolioSdg.name);
      if (cat) {
        cat.characteristics.push({
          name: invesass.characteristics
            ? invesass.characteristics.name.replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")
            : '-',

          withinboundaries:
            invesass.score == null || invesass.score == undefined
              ? 'NO'
              : 'YES',
          score: invesass.score != null && invesass.score != undefined
            ? this.getScore(invesass.score)
            : 'Outside Assessment Boundaries',
          ustifying: invesass.justification ? invesass.justification : '-',
        });
        cat.rows = cat.characteristics.length;
      } else {
        sustained_sd.sdg.push({
            rows: 1,
            name:invesass.portfolioSdg.name,
            impact:invesass.portfolioSdg?.sdg_assessment.answer?invesass.portfolioSdg.sdg_assessment.answer:'N/A',
            characteristics: [
              {
                name: invesass.characteristics
                  ? invesass.characteristics.name.replace(">", "&gt;").replace("<", "&lt;").replace("/", " /")
                  : '-',
                
                withinboundaries:
                  invesass.score == null || invesass.score == undefined
                    ? 'NO'
                    : 'YES',
                score: invesass.score != null && invesass.score != undefined
                  ? this.getScore(invesass.score)
                  : 'Outside Assessment Boundaries',
                ustifying: invesass.justification
                  ? invesass.justification
                  : '-',
              },
            ],}

        ) 
      }

    
  
  }
  
}
reportContentTwo.sustained_sd = sustained_sd;


let res =  await this.investorToolService.calculateNewAssessmentResults(assessmentId);
reportContentTwo.process_categories_assessment=res.processData;
reportContentTwo.outcomes_categories_assessment=res.outcomeData;

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

    reportContentTwo.prossesAssesmentStartingSituation = catagoryProcess;
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
    comparisonReportDto.contentOne = await this.genarateComparisonReportDtoContentOne(
      
    );
    comparisonReportDto.contentTwo = await this.genarateComparisonReportDtoContentTwo(
    );
    comparisonReportDto.contentThree = await this.genarateComparisonReportDtoContentThree(
    );
    comparisonReportDto.contentFour = await this.genarateComparisonReportDtoContentFour(
    );

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
  genarateComparisonReportDtoContentOne(): ComparisonReportReportContentOne {
    const contentOne = new ComparisonReportReportContentOne();
    
    return contentOne;
  }
  genarateComparisonReportDtoContentTwo(): ComparisonReportReportContentTwo {
    const contentOne = new ComparisonReportReportContentTwo();
    
    return contentOne;
  }
  genarateComparisonReportDtoContentThree(): ComparisonReportReportContentThree {
    const contentOne = new ComparisonReportReportContentThree();
    
    return contentOne;
  }
  genarateComparisonReportDtoContentFour(): ComparisonReportReportContentFour {
    const contentOne = new ComparisonReportReportContentFour();
    
    return contentOne;
  }
}



