import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditModule } from './audit/audit.module';
import { Audit } from './audit/entity/audit.entity';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './climate-action/climate-action.module';
import { ClimateAction } from './climate-action/entity/climate-action.entity';
import { CountryModule } from './country/country.module';
import { Country } from './country/entity/country.entity';
import { DocumentModule } from './document/document.module';
import { InstitutionModule } from './institution/institution.module';
import { LearningMaterialModule } from './learning-material/learning-material.module';
import { NdcModule } from './master-data/aggregated-action/aggregated-action.module';
import { ClimateChangeDataCategory } from './master-data/cimate-change-data-category/climate.change.data.category.entity';
import { FinancingSchemeController } from './master-data/financing-scheme/financing-scheme.controller';
import { FinancingSchemeModule } from './master-data/financing-scheme/financing-scheme.module';
import { ProjectApprovalStatusModule } from './master-data/project-approval-status/project-approval-status.module';
import { ProjectOwnerModule } from './master-data/project-owner/project-owner.module';
import { ProjectOwner } from './master-data/project-owner/projeect-owner.entity';
import { ProjectStatus } from './master-data/project-status/project-status.entity';
import { ProjectStatusModule } from './master-data/project-status/project-status.module';
import { SectorModule } from './master-data/sector/sector.module';
import { UserTypeModule } from './master-data/user-type/user-type.module';
import { ReportController } from './report/report.controller';

import { UsersModule } from './users/users.module';
import { Institution } from './institution/entity/institution.entity';
import { User } from './users/entity/user.entity';
import { TokenDetails } from './utills/token_details';
import { Category } from './methodology-assessment/entities/category.entity';
import { Characteristics } from './methodology-assessment/entities/characteristics.entity';
import { MethodologyAssessmentParameters } from './methodology-assessment/entities/methodology-assessment-parameters.entity';
import { Methodology } from './methodology-assessment/entities/methodology.entity';
import { MethodologyAssessmentModule } from './methodology-assessment/methodology-assessment.module';
import { AssessmentModule } from './assessment/assessment.module';
import { MethodologyAssessmentController } from './methodology-assessment/methodology-assessment.controller';
import { Barriers } from './methodology-assessment/entities/barriers.entity';
import { AssessmentBarriers } from './methodology-assessment/entities/assessmentbarriers.entity';
import { BarriersCategory } from './methodology-assessment/entities/barrierscategory.entity';
import { PolicyBarriers } from './climate-action/entity/policy-barriers.entity';
import { Indicators } from './methodology-assessment/entities/indicators.entity';
import { AssessmentCharacteristics } from './methodology-assessment/entities/assessmentcharacteristics.entity';
import { MethodologyIndicators } from './methodology-assessment/entities/methodologyindicators.entity';
import { ParameterRequestController as DataRequestController } from './data-request/data-request.controller';
import { ParameterRequestModule } from './data-request/data-request.module';
import { QualityCheckService } from './quality-check/quality-check.service';
import { QualityCheckController } from './quality-check/quality-check.controller';
import { QualityCheckModule } from './quality-check/quality-check.module';
import { ParameterHistoryService } from './parameter-history/parameter-history.service';
import { ParameterHistoryController } from './parameter-history/parameter-history.controller';
import { ParameterHistoryModule } from './parameter-history/parameter-history.module';
import { DefaultValueService } from './default-value/default-value.service';
import { DefaultValueController } from './default-value/default-value.controller';
import { DefaultValueModule } from './default-value/default-value.module';
import { ParameterRequestService } from './data-request/data-request.service';
import { ParameterRequest } from './data-request/entity/data-request.entity';
import { DefaultValue } from './default-value/entity/defaultValue.entity';
import { ParameterHistory } from './parameter-history/entity/parameter-history.entity';
import { Results } from './methodology-assessment/entities/results.entity';
import { AggregatedAction } from './master-data/aggregated-action/entity/aggregated-action.entity';
import { VerificationModule } from './verification/verification.module';
import { BarriersCharacteristics } from './methodology-assessment/entities/barriercharacteristics.entity';
import { Assessment } from './assessment/entities/assessment.entity';
import { NotificationModule } from './notification/notification.module';
import { AssessmentCategory } from './methodology-assessment/entities/assessmentCategory.entity';
import { Objectives } from './methodology-assessment/entities/objectives.entity';
import { AssessmentObjectives } from './methodology-assessment/entities/assessmentobjectives.entity';
import { CarbonMarketModule } from './carbon-market/carbon-market.module';
import { UsersService } from './users/users.service';
import { UserType } from './users/entity/user.type.entity';
import { ReportModule } from './report/report.module';
import { InvestorToolModule } from './investor-tool/investor-tool.module';
import { InvestorTool } from './investor-tool/entities/investor-tool.entity';
import { InvestorAssessment } from './investor-tool/entities/investor-assessment.entity';
import { IndicatorDetails } from './investor-tool/entities/indicator-details.entity';
import { InvestorQuestions } from './investor-tool/entities/investor-questions.entity';
import { PortfolioModule } from './portfolio/portfolio.module';
import { CMAssessmentAnswer } from './carbon-market/entity/cm-assessment-answer.entity';
import { PortfolioSdg } from './investor-tool/entities/portfolio-sdg.entity';
import { SdgAssessment } from './investor-tool/entities/sdg-assessment.entity';
import { BarrierCategory } from './climate-action/entity/barrier-category.entity';
import { PortfolioQuestions } from './investor-tool/entities/portfolio-questions.entity';
import { PortfolioQuestionDetails } from './investor-tool/entities/portfolio_question-details.entity';
import { MasterDataService } from './shared/entities/master-data.service';
import { SystemStatusModule } from './system-status/system-status.module';
import { SystemStatus } from './system-status/entities/system-status.entity';
import { HttpModule } from '@nestjs/axios';
import { AuditDetailService } from './utills/audit_detail.service';
import { Auth } from './auth/entities/auth.entity';
import { CountrySector } from './country/entity/country-sector.entity';
import { LearningMaterialUserType } from './learning-material/entity/learning-material-usertype.entity';
import { LearningMaterial } from './learning-material/entity/learning-material.entity';
import { Documents } from './document/entity/document.entity';
import { PolicySector } from './climate-action/entity/policy-sectors.entity';
import { BaseTrackingEntity } from './shared/entities/base.tracking.entity';
import { MasterData } from './shared/entities/master.data.entity';
import { MethodologyParameters } from './methodology-assessment/entities/methodologyParameters.entity';
import { CalcParameters } from './methodology-assessment/entities/calcParameters.entity';
import { ParameterStatus } from './methodology-assessment/entities/parameterStatus.entity';
import { GeographicalAreasCovered } from './investor-tool/entities/geographical-areas-covered.entity';
import { InvestorSector } from './investor-tool/entities/investor-sector.entity';
import { ActionArea } from './master-data/action-area/entity/action-area.entity';
import { Sector } from './master-data/sector/entity/sector.entity';
import { InstitutionCategory } from './institution/entity/institution.category.entity';
import { InstitutionType } from './institution/entity/institution.type.entity';
import { FinancingScheme } from './master-data/financing-scheme/financing-scheme.entity';
import { ProjectApprovalStatus } from './master-data/project-approval-status/project-approval-status.entity';
import { InvestorImpacts } from './investor-tool/entities/investor-impact.entity';
import { ImpactCovered } from './investor-tool/entities/impact-covered.entity';
import { Notification } from './notification/notification.entity';
import { NdcSet } from './master-data/aggregated-action/ndc-set.entity';
import { TotalInvestment } from './investor-tool/entities/total-investment.entity';
import { AssessmentCMDetail } from './carbon-market/entity/assessment-cm-detail.entity';
import { CMAssessmentQuestion } from './carbon-market/entity/cm-assessment-question.entity';
import { CMQuestion } from './carbon-market/entity/cm-question.entity';
import { Criteria } from './carbon-market/entity/criteria.entity';
import { Section } from './carbon-market/entity/section.entity';
import { CMAnswer } from './carbon-market/entity/cm-answer.entity';
import { ConfigModule } from '@nestjs/config';
import { Portfolio } from './portfolio/entities/portfolio.entity';
import { PortfolioAssessment } from './portfolio/entities/portfolioAssessment.entity';
import { SdgPriority } from './investor-tool/entities/sdg-priority.entity';
import { Report } from './report/entities/report.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CMDefaultValue } from './carbon-market/entity/cm-default-value.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  
    }),
    AuditModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      socketPath: process.env.SOCKET_PATH,
      // host:  process.env.DATABASE_HOST,
      port:  parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database:  process.env.DATABASE_NAME,

      entities: [Assessment, Audit, Auth, ClimateAction, PolicyBarriers, Country, CountrySector, ParameterRequest, DefaultValue, CMAssessmentAnswer, CMAssessmentQuestion,
        Documents, InstitutionType, Institution, InstitutionCategory, LearningMaterial, LearningMaterialUserType, NdcSet, TotalInvestment, AssessmentCMDetail, CMQuestion,
        ClimateChangeDataCategory, FinancingScheme, ProjectApprovalStatus, ProjectOwner, ProjectStatus, Sector, UserType, AssessmentBarriers, AssessmentCharacteristics,Report,
        Characteristics, Barriers, BarriersCategory, Category, Indicators, MethodologyAssessmentParameters, Methodology, MethodologyIndicators, ParameterStatus, AggregatedAction, ActionArea,
        ParameterHistory, BaseTrackingEntity, MasterData, User, MethodologyParameters, CalcParameters, ImpactCovered, InvestorTool, InvestorSector, InvestorImpacts, InvestorAssessment, Notification,
        PolicySector, InvestorQuestions, IndicatorDetails, PortfolioSdg, SdgAssessment, BarrierCategory, PortfolioQuestions, PortfolioQuestionDetails, GeographicalAreasCovered, SystemStatus,
        Criteria, Section, CMAnswer, Results, BarriersCharacteristics, AssessmentCategory, Objectives, AssessmentObjectives, Portfolio, PortfolioAssessment, SdgPriority, CMDefaultValue],

      synchronize: true,
      migrationsRun: false,
      logging: true,
      logger: 'file',
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],

    }),
    TypeOrmModule.forFeature([
      User,
      Country,
      ClimateAction,
      AggregatedAction,
      Institution,
      MethodologyAssessmentParameters,
      AssessmentCharacteristics,
      ParameterRequest,
      DefaultValue,
      ParameterHistory,
      MethodologyIndicators,
      Results,
      BarriersCharacteristics,
      AssessmentCategory,
      Assessment,
      Objectives,
      AssessmentObjectives,
      UserType,
      InvestorTool,
      IndicatorDetails,
      InvestorQuestions,
      InvestorAssessment,
      CMAssessmentAnswer,
      PortfolioSdg,
      SdgAssessment,
      BarrierCategory,
      PortfolioQuestions,
      PortfolioQuestionDetails,
      SystemStatus,
      Portfolio,
    ]),
    UsersModule,
    UserTypeModule,
    ProjectModule,
    NdcModule,
    SectorModule,
    AuditModule,
    CountryModule,
    ProjectOwnerModule,
    ProjectStatusModule,
    FinancingSchemeModule,
    DocumentModule,
    AuthModule,
    ProjectApprovalStatusModule,
    LearningMaterialModule,
    ReportModule,
    MethodologyAssessmentModule,
    AssessmentModule,
    InstitutionModule,
    SystemStatusModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
      },
      defaults: {
        from: '"Admin"' + process.env.EMAIL,
      },
    }),
    ParameterRequestModule,
    QualityCheckModule,
    ParameterHistoryModule,
    DefaultValueModule,
    VerificationModule,
    NotificationModule,
    CarbonMarketModule,
    CarbonMarketModule,
    InvestorToolModule,
    PortfolioModule,
    HttpModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [
    AppController,
    FinancingSchemeController,
    FinancingSchemeController,
    MethodologyAssessmentController,
    ReportController,
    DataRequestController,
    QualityCheckController,
    ParameterHistoryController,
    DefaultValueController,
  ],
  providers: [AppService, TokenDetails, ParameterRequestService, QualityCheckService, UsersService,
    ParameterHistoryService, DefaultValueService, MasterDataService, AuditDetailService],
})
export class AppModule { }
