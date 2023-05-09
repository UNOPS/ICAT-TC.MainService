import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InvestorToolService } from './investor-tool.service';
import { CreateInvestorToolDto } from './dto/create-investor-tool.dto';
import { UpdateInvestorToolDto } from './dto/update-investor-tool.dto';
import { ApiTags } from '@nestjs/swagger';
import { InvestorAssessment } from './entities/investor-assessment.entity';

ApiTags('investor-tool')
@Controller('investor-tool')
export class InvestorToolController {
  constructor(private readonly investorToolService: InvestorToolService) {}

  @Post('createinvestorToolAssessment')
  createinvestorToolAssessment(@Body() createInvestorToolDto: CreateInvestorToolDto) {
    return this.investorToolService.createinvestorToolAssessment(createInvestorToolDto);
  }


  @Post('createFinalAssessment')
  createFinalAssessment(@Body() req: InvestorAssessment) {
    return this.investorToolService.createFinalAssessment(req);
  }

  

  @Get('findAllImpactCovered')
  findAllImpactCovered() {
    return this.investorToolService.findAllImpactCovered();
  }

}
