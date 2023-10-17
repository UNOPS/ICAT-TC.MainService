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
import { Country } from 'src/country/entity/country.entity';
import { CountryModule } from 'src/country/country.module';
import { TokenDetails } from 'src/utills/token_details';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { AssessmentObjectives } from 'src/methodology-assessment/entities/assessmentobjectives.entity';
import { InvestorToolService } from 'src/investor-tool/investor-tool.service';
import { InvestorToolModule } from 'src/investor-tool/investor-tool.module';
import { Audit } from 'src/audit/entity/audit.entity';
import { ClimateAction } from 'src/climate-action/entity/climate-action.entity';
import { PolicyBarriers } from 'src/climate-action/entity/policy-barriers.entity';
import { PolicySector } from 'src/climate-action/entity/policy-sectors.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { Institution } from 'src/institution/entity/institution.entity';
import { ImpactCovered } from 'src/investor-tool/entities/impact-covered.entity';
import { IndicatorDetails } from 'src/investor-tool/entities/indicator-details.entity';
import { InvestorAssessment } from 'src/investor-tool/entities/investor-assessment.entity';
import { InvestorImpacts } from 'src/investor-tool/entities/investor-impact.entity';
import { InvestorQuestions } from 'src/investor-tool/entities/investor-questions.entity';
import { InvestorSector } from 'src/investor-tool/entities/investor-sector.entity';
import { InvestorTool } from 'src/investor-tool/entities/investor-tool.entity';
import { PortfolioQuestions } from 'src/investor-tool/entities/portfolio-questions.entity';
import { PortfolioSdg } from 'src/investor-tool/entities/portfolio-sdg.entity';
import { PortfolioQuestionDetails } from 'src/investor-tool/entities/portfolio_question-details.entity';
import { SdgAssessment } from 'src/investor-tool/entities/sdg-assessment.entity';
import { AssessmentCategory } from 'src/methodology-assessment/entities/assessmentCategory.entity';
import { AssessmentBarriers } from 'src/methodology-assessment/entities/assessmentbarriers.entity';
import { AssessmentCharacteristics } from 'src/methodology-assessment/entities/assessmentcharacteristics.entity';
import { BarriersCharacteristics } from 'src/methodology-assessment/entities/barriercharacteristics.entity';
import { Barriers } from 'src/methodology-assessment/entities/barriers.entity';
import { BarriersCategory } from 'src/methodology-assessment/entities/barrierscategory.entity';
import { CalculationResults } from 'src/methodology-assessment/entities/calculationResults.entity';
import { Category } from 'src/methodology-assessment/entities/category.entity';
import { Characteristics } from 'src/methodology-assessment/entities/characteristics.entity';
import { Indicators } from 'src/methodology-assessment/entities/indicators.entity';
import { MethodologyAssessmentParameters } from 'src/methodology-assessment/entities/methodology-assessment-parameters.entity';
import { Methodology } from 'src/methodology-assessment/entities/methodology.entity';
import { MethodologyParameters } from 'src/methodology-assessment/entities/methodologyParameters.entity';
import { MethodologyIndicators } from 'src/methodology-assessment/entities/methodologyindicators.entity';
import { Objectives } from 'src/methodology-assessment/entities/objectives.entity';
import { ParameterStatus } from 'src/methodology-assessment/entities/parameterStatus.entity';
import { Results } from 'src/methodology-assessment/entities/results.entity';
import { User } from 'src/users/entity/user.entity';
import { UserType } from 'src/users/entity/user.type.entity';
import { MethodologyAssessmentModule } from 'src/methodology-assessment/methodology-assessment.module';
import { GeographicalAreasCovered } from 'src/investor-tool/entities/geographical-areas-covered.entity';
import { PortfolioService } from 'src/portfolio/portfolio.service';
import { PortfolioModule } from 'src/portfolio/portfolio.module';
import { Portfolio } from 'src/portfolio/entities/portfolio.entity';
import { PortfolioAssessment } from 'src/portfolio/entities/portfolioAssessment.entity';
import { CMAssessmentQuestionService } from 'src/carbon-market/service/cm-assessment-question.service';
import { MasterDataService } from 'src/shared/entities/master-data.service';
import { CMAssessmentQuestion } from 'src/carbon-market/entity/cm-assessment-question.entity';
import { CMAssessmentAnswer } from 'src/carbon-market/entity/cm-assessment-answer.entity';
import { SdgPriority } from 'src/investor-tool/entities/sdg-priority.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Report,
      Assessment,
      Country,
      AssessmentObjectives,
      Assessment,
      ImpactCovered,
      InvestorTool,
      InvestorSector,
      InvestorImpacts,
      InvestorAssessment, 
      Results,
      InvestorQuestions,
      IndicatorDetails,
      Category,
      ParameterRequest,
      InvestorAssessment,
      SdgAssessment,
      PortfolioSdg,
      PolicySector,
      User, UserType, Institution,Audit,
      Methodology,
      Characteristics,
      MethodologyAssessmentParameters,
      AssessmentBarriers,
      ClimateAction,
      Barriers,
      BarriersCategory,
      ParameterStatus,
      PolicyBarriers,
      Indicators,
      AssessmentCharacteristics,
      MethodologyIndicators,
      BarriersCharacteristics,
      AssessmentCategory,
      Objectives,
      MethodologyParameters,
      CalculationResults,
      PortfolioQuestions,
      PortfolioQuestionDetails,
      GeographicalAreasCovered,
      Portfolio,
      PortfolioAssessment,
      CMAssessmentQuestion,
      CMAssessmentAnswer,
      SdgPriority
    ]), 
    UsersModule,
    CountryModule,
    InvestorToolModule,
    MethodologyAssessmentModule,
    PortfolioModule
  ],
  controllers: [ReportController],
  providers: [ReportService, ReportGenaratesService, ReportHtmlGenaratesService, ReportPagesService, AssessmentPagesService, AssessmentService, TokenDetails, EmailNotificationService,InvestorToolService,PortfolioService,CMAssessmentQuestionService,MasterDataService,],
  exports: [ReportService,ReportGenaratesService, ReportHtmlGenaratesService,AssessmentService, EmailNotificationService,InvestorToolService,],
})
export class ReportModule {}
