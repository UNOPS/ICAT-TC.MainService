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
import { ReportModule } from './report/report.module';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Institution } from './institution/entity/institution.entity';
import { MulterModule } from '@nestjs/platform-express';
import { config } from './ormconfig';
import { User } from './users/user.entity';
import { TokenDetails } from './utills/token_details';
import { Category } from './methodology-assessment/entities/category.entity';
import { Characteristics } from './methodology-assessment/entities/characteristics.entity';
import { MethodologyAssessmentParameters } from './methodology-assessment/entities/methodology-assessment-parameters.entity';
import { Methodology } from './methodology-assessment/entities/methodology.entity';
import { MethodologyAssessmentModule } from './methodology-assessment/methodology-assessment.module';
import { AssessmentModule } from './assessment/assessment.module';
import { MethodologyAssessmentController } from './methodology-assessment/methodology-assessment.controller';
// import {config} from './config';

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
      Institution,
      Methodology,
      Category,
      Characteristics,
      MethodologyAssessmentParameters,

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../static-files'),
      renderPath: 'icatcountryportal',
      exclude: ['/api*'],
      serveStaticOptions: { index: false },

    }),
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
    

  ],
  controllers: [
    AppController,
    FinancingSchemeController,
    FinancingSchemeController,
    MethodologyAssessmentController,
    ReportController,
    // InstitutionCategoryController,
    // UserController,
  ],
  providers: [AppService,TokenDetails],
})
export class AppModule { }
