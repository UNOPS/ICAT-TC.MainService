import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Institution } from './institution/entity/institution.entity';
import { MulterModule } from '@nestjs/platform-express';
import { config } from './ormconfig';
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
// import {config} from './config';
// import { DataRequestService } from './data-request/data-request.service';
import {ParameterRequestController as DataRequestController } from './data-request/data-request.controller';
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

@Module({
  imports: [
    AuditModule,
    TypeOrmModule.forRoot(config),
    MulterModule.register({
      dest: './uploads',
    }),
    TypeOrmModule.forFeature([
      User,
      Audit,
      ProjectStatus,
      ProjectOwner,
      ClimateChangeDataCategory,
      Country,
      ClimateAction,
      AggregatedAction,
      Institution,
      Methodology,
      Category,
      Characteristics,
      MethodologyAssessmentParameters,
      Barriers,
      AssessmentBarriers,
      BarriersCategory,
      PolicyBarriers,
      Indicators,
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
      InvestorAssessment
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
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', '../static-files'),
    //   renderPath: 'icatcountryportal',
    //   exclude: ['/api*'],
    //   serveStaticOptions: { index: false },

    // }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.office365.com',
        port: 587,
        secure: false,

        auth: {
          user: "no-reply-icat-ca-tool@climatesi.com",
          pass: "ICAT2022tool",

        },
        // 'smtp://janiya.rolfson49@ethereal.email:T8pnMS7xzzX7k3QSkM@ethereal.email',
      },
      defaults: {
        from: '"Admin" <no-reply-icat-ca-tool@climatesi.com>',
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    // MulterModule.register({dest: './public'}),
    ParameterRequestModule,
    QualityCheckModule,
    ParameterHistoryModule,
    DefaultValueModule,
    VerificationModule,
    CarbonMarketModule,
    InvestorToolModule

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
    // InstitutionCategoryController,
    // UserController,
  ],
  providers: [AppService,TokenDetails, ParameterRequestService, QualityCheckService,UsersService,
     ParameterHistoryService, DefaultValueService],
})
export class AppModule { }
