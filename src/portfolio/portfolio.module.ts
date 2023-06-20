import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioAssessment } from './entities/portfolioAssessment.entity';
import { InvestorAssessment } from 'src/investor-tool/entities/investor-assessment.entity';

@Module({
  controllers: [PortfolioController],
  providers: [PortfolioService],
  imports: [TypeOrmModule.forFeature([
    Portfolio, PortfolioAssessment, InvestorAssessment
  ])],
  exports: [
    PortfolioService
  ]
})
export class PortfolioModule {}
