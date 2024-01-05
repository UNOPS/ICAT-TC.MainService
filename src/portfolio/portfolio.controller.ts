import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, InternalServerErrorException } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { Portfolio } from './entities/portfolio.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuditDetailService } from 'src/utills/audit_detail.service';


@Controller('portfolio')
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private auditDetailService: AuditDetailService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() createPortfolioDto: Portfolio): Promise<any> {
    let details = await this.auditDetailService.getAuditDetails()
    let obj = {
      description: 'Create portfolio'
    }
    let body = { ...details, ...obj }
    try {
      body = { ...body, ...{ actionStatus: 'Created successfully'} }
      this.auditDetailService.log(body)
      return await this.portfolioService.create(createPortfolioDto);
    } catch (error) {
      body = { ...body, ...{ actionStatus: 'Failed to create portfolio' } }
      this.auditDetailService.log(body)
      throw new InternalServerErrorException(error)
    }
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
  @UseGuards(JwtAuthGuard)
  @Get('sdgSumCalculate/:portfolioId')
  async sdgSumCalculate(@Param('portfolioId') portfolioId: number) {
    return await this.portfolioService.sdgSumCalculate(portfolioId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard-data')
  async getDashboardData(
    @Query('PortfolioID') PortfolioID: number,
    @Query('page') page: number,
    @Query('limit') limit: number
    ):Promise<any> {
    return await this.portfolioService.getDashboardData( PortfolioID,{
      limit: limit,
      page: page,
    },);
  }

  
  @UseGuards(JwtAuthGuard)
  @Get('get-comparison-data/:portfolioId')
  async getPortfolioComparisonData(@Param('portfolioId') portfolioId: number){
    return this.portfolioService.getPortfolioComparisonData(portfolioId)
  }
}
