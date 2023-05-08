import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InvestorToolService } from './investor-tool.service';
import { CreateInvestorToolDto } from './dto/create-investor-tool.dto';
import { UpdateInvestorToolDto } from './dto/update-investor-tool.dto';
import { ApiTags } from '@nestjs/swagger';

ApiTags('investor-tool')
@Controller('investor-tool')
export class InvestorToolController {
  constructor(private readonly investorToolService: InvestorToolService) {}

  @Post('createinvestorToolAssessment')
  createinvestorToolAssessment(@Body() createInvestorToolDto: CreateInvestorToolDto) {
    return this.investorToolService.createinvestorToolAssessment(createInvestorToolDto);
  }

  @Get('findAllImpactCovered')
  findAllImpactCovered() {
    return this.investorToolService.findAllImpactCovered();
  }

}
