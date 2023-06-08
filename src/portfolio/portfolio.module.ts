import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { PortfolioAssessment } from './entities/portfolioAssessment.entity';

@Module({
  controllers: [PortfolioController],
  providers: [PortfolioService],
  imports: [TypeOrmModule.forFeature([
    Portfolio, PortfolioAssessment
  ])],
  exports: [
    PortfolioService
  ]
})
export class PortfolioModule {}
