import { Module } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { TokenDetails } from 'src/utills/token_details';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assessment } from './entities/assessment.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entity/user.entity';
import { UsersModule } from 'src/users/users.module';
import { Institution } from 'src/institution/entity/institution.entity';
import { UserType } from 'src/users/entity/user.type.entity';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { Country } from 'src/country/entity/country.entity';
import { AssessmentObjectives } from 'src/methodology-assessment/entities/assessmentobjectives.entity';
import { InvestorToolModule } from 'src/investor-tool/investor-tool.module';
import { InvestorToolService } from 'src/investor-tool/investor-tool.service';
import { PortfolioAssessment } from 'src/portfolio/entities/portfolioAssessment.entity';
import { Results } from 'src/methodology-assessment/entities/results.entity';
import { SdgAssessment } from 'src/investor-tool/entities/sdg-assessment.entity';
import { PolicyBarriers } from 'src/climate-action/entity/policy-barriers.entity';
import { BarrierCategory } from 'src/climate-action/entity/barrier-category.entity';
import { CarbonMarketModule } from 'src/carbon-market/carbon-market.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assessment,
    User, 
    Institution, 
    UserType, 
    Country, 
    AssessmentObjectives, 
    PortfolioAssessment,
    Results,
    SdgAssessment,
    PolicyBarriers,
    BarrierCategory
  ]), UsersModule, InvestorToolModule, CarbonMarketModule],
  controllers: [AssessmentController],
  providers: [AssessmentService, TokenDetails, UsersService, EmailNotificationService],
  exports: [AssessmentService]
})
export class AssessmentModule { }
