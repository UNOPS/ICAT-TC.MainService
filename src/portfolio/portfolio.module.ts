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

@Module({
  controllers: [PortfolioController],
  providers: [PortfolioService,  TokenDetails, EmailNotificationService, UsersService,],
  imports: [TypeOrmModule.forFeature([
    Portfolio, PortfolioAssessment, InvestorAssessment,SdgAssessment,
    User, UserType, Institution, Country,Audit, Assessment,
  ])],
  exports: [
    PortfolioService
  ]
})
export class PortfolioModule {}
