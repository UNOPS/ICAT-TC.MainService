import { ConnectionOptions, DataSourceOptions } from 'typeorm';
import { Assessment } from './assessment/entities/assessment.entity';
import { Audit } from './audit/entity/audit.entity';
import { Auth } from './auth/entities/auth.entity';
import { ClimateAction } from './climate-action/entity/climate-action.entity';
import { PolicyBarriers } from './climate-action/entity/policy-barriers.entity';
import { CountrySector } from './country/entity/country-sector.entity';
import { countryStatus } from './country/entity/country-status.entity';
import { Country } from './country/entity/country.entity';
import { DataRequestStatus } from './data-request/entity/data-request-status.entity';
import { ParameterRequest } from './data-request/entity/data-request.entity';
import { DefaultValue } from './default-value/entity/defaultValue.entity';
import { DocumentOwner } from './document/entity/document-owner.entity';
import { Documents } from './document/entity/document.entity';
import { InstitutionCategory } from './institution/entity/institution.category.entity';
import { Institution } from './institution/entity/institution.entity';
import { InstitutionType } from './institution/entity/institution.type.entity';
import { LearningMaterialUserType } from './learning-material/entity/learning-material-usertype.entity';
import { LearningMaterial } from './learning-material/entity/learning-material.entity';
import { ActionArea } from './master-data/action-area/entity/action-area.entity';
import { AggregatedAction } from './master-data/aggregated-action/entity/aggregated-action.entity';
import { ClimateChangeDataCategory } from './master-data/cimate-change-data-category/climate.change.data.category.entity';
import { FinancingScheme } from './master-data/financing-scheme/financing-scheme.entity';
import { ProjectApprovalStatus } from './master-data/project-approval-status/project-approval-status.entity';
import { ProjectOwner } from './master-data/project-owner/projeect-owner.entity';
import { ProjectStatus } from './master-data/project-status/project-status.entity';
import { Sector } from './master-data/sector/entity/sector.entity';
import { AssessmentBarriers } from './methodology-assessment/entities/assessmentbarriers.entity';
import { AssessmentCharacteristics } from './methodology-assessment/entities/assessmentcharacteristics.entity';
import { Barriers } from './methodology-assessment/entities/barriers.entity';
import { BarriersCategory } from './methodology-assessment/entities/barrierscategory.entity';
import { Category } from './methodology-assessment/entities/category.entity';
import { Characteristics } from './methodology-assessment/entities/characteristics.entity';
import { Indicators } from './methodology-assessment/entities/indicators.entity';
import { MethodologyAssessmentParameters } from './methodology-assessment/entities/methodology-assessment-parameters.entity';
import { Methodology } from './methodology-assessment/entities/methodology.entity';
import { MethodologyIndicators } from './methodology-assessment/entities/methodologyindicators.entity';
import { ParameterStatus } from './methodology-assessment/entities/parameterStatus.entity';
import { ParameterHistoryAction } from './parameter-history/entity/parameter-history-action-history.entity';
import { ParameterHistory } from './parameter-history/entity/parameter-history.entity';

import { BaseTrackingEntity } from './shared/entities/base.tracking.entity';
import { MasterData } from './shared/entities/master.data.entity';
import { User } from './users/entity/user.entity';
import { UserType } from './users/entity/user.type.entity';
import { Notification } from './notification/notification.entity';
import { Objectives } from './methodology-assessment/entities/objectives.entity';
import { Report } from './report/entities/report.entity';
import { MethodologyParameters } from './methodology-assessment/entities/methodologyParameters.entity';
import { CalcParameters } from './methodology-assessment/entities/calcParameters.entity';
import { InvestorAssessment } from './investor-tool/entities/investor-assessment.entity';
import { ImpactCovered } from './investor-tool/entities/impact-covered.entity';
import { InvestorTool } from './investor-tool/entities/investor-tool.entity';
import { InvestorSector } from './investor-tool/entities/investor-sector.entity';
import { InvestorImpacts } from './investor-tool/entities/investor-impact.entity';
import { PolicySector } from './climate-action/entity/policy-sectors.entity';
import { InvestorQuestions } from './investor-tool/entities/investor-questions.entity';
import { IndicatorDetails } from './investor-tool/entities/indicator-details.entity';
import { PortfolioSdg } from './investor-tool/entities/portfolio-sdg.entity';
import { SdgAssessment } from './investor-tool/entities/sdg-assessment.entity';


export const config: ConnectionOptions = {
  // name: 'Real',
  type: 'mysql',
  host: 'localhost',
  port: 3306,


/*  username: 'root',
 password: 'pradeep123#',
 database: 'tc-main',   */
//  username: 'root',
//  password: 'pradeep123#',
//  database: 'tc-main',  
     username: 'sqluser',
  password: 'password',
   database: 'tc-main-new3',  
   /*    username: 'root',
      password: '1997',
      database: 'tc_new', */
     
  // username: 'root',
  //  database: 'tc-main', 
  //  password: '7860150',  // database: 'tc-main-new3',

  autoLoadEntities: true,
  // entities: [__dirname + '/../**/*.entity.{js,ts}'],
  entities: [Assessment,Audit,Auth,ClimateAction,PolicyBarriers,Country,CountrySector,countryStatus,DataRequestStatus, ParameterRequest,DefaultValue,
    Documents,DocumentOwner, InstitutionType,Institution,InstitutionCategory, LearningMaterial,LearningMaterialUserType,AggregatedAction,ActionArea,
ClimateChangeDataCategory,FinancingScheme,ProjectApprovalStatus,ProjectOwner,ProjectStatus,Sector,UserType,AssessmentBarriers,AssessmentCharacteristics,
Characteristics,Barriers,BarriersCategory,Category,Indicators,MethodologyAssessmentParameters,Methodology,MethodologyIndicators,ParameterStatus,
ParameterHistory,Report,BaseTrackingEntity,MasterData,User,MethodologyParameters,CalcParameters,ImpactCovered,InvestorTool,InvestorSector,InvestorImpacts,InvestorAssessment,Notification,
PolicySector,InvestorQuestions,IndicatorDetails,PortfolioSdg,SdgAssessment],

  // We are using migrations, synchronize should be set to false.
  synchronize: true,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: false,
  logging: true,
  logger: 'file',

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'src/migrations',
  },
};

