import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioAssessment } from './entities/portfolioAssessment.entity';
import { InvestorAssessment } from 'src/investor-tool/entities/investor-assessment.entity';
import { SdgAssessment } from 'src/investor-tool/entities/sdg-assessment.entity';
import { UserType } from 'src/users/entity/user.type.entity';
import { User } from 'src/users/entity/user.entity';
import { Institution } from 'src/institution/entity/institution.entity';
import { Country } from 'src/country/entity/country.entity';
import { Audit } from 'src/audit/entity/audit.entity';
import { TokenDetails } from 'src/utills/token_details';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { UsersService } from 'src/users/users.service';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { CMAssessmentQuestionService } from 'src/carbon-market/service/cm-assessment-question.service';
import { CMAssessmentQuestion } from 'src/carbon-market/entity/cm-assessment-question.entity';
import { CMAssessmentAnswer } from 'src/carbon-market/entity/cm-assessment-answer.entity';
import { Results } from 'src/methodology-assessment/entities/results.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { Characteristics } from 'src/methodology-assessment/entities/characteristics.entity';
import { MasterDataService } from 'src/shared/entities/master-data.service';
import { InvestorToolService } from 'src/investor-tool/investor-tool.service';
import { InvestorTool } from 'src/investor-tool/entities/investor-tool.entity';
import { ImpactCovered } from 'src/investor-tool/entities/impact-covered.entity';
import { InvestorSector } from 'src/investor-tool/entities/investor-sector.entity';
import { InvestorImpacts } from 'src/investor-tool/entities/investor-impact.entity';
import { InvestorQuestions } from 'src/investor-tool/entities/investor-questions.entity';
import { IndicatorDetails } from 'src/investor-tool/entities/indicator-details.entity';
import { Category } from 'src/methodology-assessment/entities/category.entity';
import { PortfolioSdg } from 'src/investor-tool/entities/portfolio-sdg.entity';
import { PolicySector } from 'src/climate-action/entity/policy-sectors.entity';
import { PortfolioQuestions } from 'src/investor-tool/entities/portfolio-questions.entity';
import { MethodologyAssessmentService } from 'src/methodology-assessment/methodology-assessment.service';
import { MethodologyAssessmentParameters } from 'src/methodology-assessment/entities/methodology-assessment-parameters.entity';
import { Methodology } from 'src/methodology-assessment/entities/methodology.entity';
import { Barriers } from 'src/methodology-assessment/entities/barriers.entity';
import { AssessmentBarriers } from 'src/methodology-assessment/entities/assessmentbarriers.entity';
import { BarrierCategory } from 'src/climate-action/entity/barrier-category.entity';
import { BarriersCategory } from 'src/methodology-assessment/entities/barrierscategory.entity';
import { Indicators } from 'src/methodology-assessment/entities/indicators.entity';
import { AssessmentCharacteristics } from 'src/methodology-assessment/entities/assessmentcharacteristics.entity';
import { MethodologyIndicators } from 'src/methodology-assessment/entities/methodologyindicators.entity';
import { PolicyBarriers } from 'src/climate-action/entity/policy-barriers.entity';
import { BarriersCharacteristics } from 'src/methodology-assessment/entities/barriercharacteristics.entity';
import { AssessmentCategory } from 'src/methodology-assessment/entities/assessmentCategory.entity';
import { Objectives } from 'src/methodology-assessment/entities/objectives.entity';
import { AssessmentObjectives } from 'src/methodology-assessment/entities/assessmentobjectives.entity';
import { MethodologyParameters } from 'src/methodology-assessment/entities/methodologyParameters.entity';
import { CalculationResults } from 'src/methodology-assessment/entities/calculationResults.entity';

@Module({
  controllers: [PortfolioController],
  providers: [
    PortfolioService,  
    TokenDetails, 
    EmailNotificationService, 
    UsersService, 
    CMAssessmentQuestionService, 
    MasterDataService,
    InvestorToolService,
    MethodologyAssessmentService
  ],
  imports: [TypeOrmModule.forFeature([
    Portfolio, PortfolioAssessment, InvestorAssessment,SdgAssessment,
    User, UserType, Institution, Country,Audit, CMAssessmentQuestion,
    CMAssessmentAnswer, Results, Assessment, ParameterRequest, Characteristics,
    InvestorTool, ImpactCovered, InvestorSector, InvestorImpacts, InvestorQuestions, 
    IndicatorDetails, Category, ParameterRequest, PortfolioSdg, SdgAssessment, PolicySector,
    PortfolioQuestions, MethodologyAssessmentParameters, Methodology, Barriers, AssessmentBarriers,
    BarriersCategory, Indicators, AssessmentCharacteristics, MethodologyIndicators,PolicyBarriers,
    BarriersCharacteristics, AssessmentCategory, Objectives,  AssessmentObjectives, MethodologyParameters,
    CalculationResults

  ])],
  exports: [
    PortfolioService
  ]
})
export class PortfolioModule {}
