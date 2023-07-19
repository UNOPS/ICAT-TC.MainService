import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { Portfolio } from './entities/portfolio.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() createPortfolioDto: Portfolio): Promise<any> {
    return await this.portfolioService.create(createPortfolioDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAllPortfolios')
  async getAll() {
    return await this.portfolioService.getAll();
  }


  @Get('assessmentsByPortfolioId/:portfolioId')
  async assessmentsByPortfolioId(@Param('portfolioId') portfolioId: number) {
    return await this.portfolioService.assessmentsByPortfolioId(portfolioId);
  }

  @Get('getPortfolioById/:portfolioId')
  async getPortfolioById(@Param('portfolioId') portfolioId: number) {
    return await this.portfolioService.getPortfolioById(portfolioId);
  }


  @Get('assessmentsDataByAssessmentId/:portfolioId')
  async assessmentsDataByAssessmentId(@Param('portfolioId') portfolioId: number) {
    return await this.portfolioService.assessmentsDataByAssessmentId(portfolioId);
  }


  @Get('getLastID')
  async getLastID() {
    return await this.portfolioService.getLastID();
  }
  @Get('sdgSumCalculate/:portfolioId')
  async sdgSumCalculate(@Param('portfolioId') portfolioId: number) {
    return await this.portfolioService.sdgSumCalculate(portfolioId);
  }
}
