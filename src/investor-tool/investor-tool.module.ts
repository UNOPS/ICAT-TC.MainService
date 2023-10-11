import { Module } from '@nestjs/common';
import { InvestorToolService } from './investor-tool.service';
import { InvestorToolController } from './investor-tool.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { ImpactCovered } from './entities/impact-covered.entity';
import { InvestorTool } from './entities/investor-tool.entity';
import { InvestorSector } from './entities/investor-sector.entity';
import { InvestorImpacts } from './entities/investor-impact.entity';
import { InvestorAssessment } from './entities/investor-assessment.entity';
import { Results } from 'src/methodology-assessment/entities/results.entity';
import { InvestorQuestions } from './entities/investor-questions.entity';
import { IndicatorDetails } from './entities/indicator-details.entity';
import { Category } from 'src/methodology-assessment/entities/category.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { PortfolioSdg } from './entities/portfolio-sdg.entity';
import { SdgAssessment } from './entities/sdg-assessment.entity';
import { PolicySector } from 'src/climate-action/entity/policy-sectors.entity';
import { User } from 'src/users/entity/user.entity';
import { Institution } from 'src/institution/entity/institution.entity';
import { UserType } from 'src/users/entity/user.type.entity';
import { Country } from 'src/country/entity/country.entity';
import { Audit } from 'src/audit/entity/audit.entity';
import { TokenDetails } from 'src/utills/token_details';
import { UsersService } from 'src/users/users.service';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { MethodologyAssessmentService } from 'src/methodology-assessment/methodology-assessment.service';
import { ClimateAction } from 'src/climate-action/entity/climate-action.entity';
import { PolicyBarriers } from 'src/climate-action/entity/policy-barriers.entity';
import { AssessmentCategory } from 'src/methodology-assessment/entities/assessmentCategory.entity';
import { AssessmentBarriers } from 'src/methodology-assessment/entities/assessmentbarriers.entity';
import { AssessmentCharacteristics } from 'src/methodology-assessment/entities/assessmentcharacteristics.entity';
import { AssessmentObjectives } from 'src/methodology-assessment/entities/assessmentobjectives.entity';
import { BarriersCharacteristics } from 'src/methodology-assessment/entities/barriercharacteristics.entity';
import { Barriers } from 'src/methodology-assessment/entities/barriers.entity';
import { BarriersCategory } from 'src/methodology-assessment/entities/barrierscategory.entity';
import { CalculationResults } from 'src/methodology-assessment/entities/calculationResults.entity';
import { Characteristics } from 'src/methodology-assessment/entities/characteristics.entity';
import { Indicators } from 'src/methodology-assessment/entities/indicators.entity';
import { MethodologyAssessmentParameters } from 'src/methodology-assessment/entities/methodology-assessment-parameters.entity';
import { Methodology } from 'src/methodology-assessment/entities/methodology.entity';
import { MethodologyParameters } from 'src/methodology-assessment/entities/methodologyParameters.entity';
import { MethodologyIndicators } from 'src/methodology-assessment/entities/methodologyindicators.entity';
import { Objectives } from 'src/methodology-assessment/entities/objectives.entity';
import { ParameterStatus } from 'src/methodology-assessment/entities/parameterStatus.entity';
import { PortfolioQuestions } from './entities/portfolio-questions.entity';
import { PortfolioQuestionDetails } from './entities/portfolio_question-details.entity';
import { GeographicalAreasCovered } from './entities/geographical-areas-covered.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
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
    User, UserType, Institution, Country,Audit,
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
    AssessmentObjectives,
    MethodologyParameters,
    CalculationResults,
    PortfolioQuestions,
    PortfolioQuestionDetails,
    GeographicalAreasCovered
    
    
  ])],
  controllers: [InvestorToolController],
  providers: [InvestorToolService, TokenDetails, EmailNotificationService,
    UsersService,MethodologyAssessmentService]
})
export class InvestorToolModule {}
