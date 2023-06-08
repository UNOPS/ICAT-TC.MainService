import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { Portfolio } from './entities/portfolio.entity';


@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post('create')
  async create(@Body() createPortfolioDto: Portfolio): Promise<any> {
    return await this.portfolioService.create(createPortfolioDto);
  }


}
