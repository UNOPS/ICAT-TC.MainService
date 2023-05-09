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

  @Get('get-results-by-assessment/:assessmentId')
  async getResultByAssessment(@Param('assessmentId') assessmentId: number) {
    return await this.investorToolService.getResultByAssessment(assessmentId);
  }

  @Get('findAllSectorData/:assessmentId')
  async findAllSectorData(@Param('assessmentId') assessmentId: number) {
    return await this.investorToolService.findAllSectorData(assessmentId);
  }

  @Get('findAllImpactCoverData/:assessmentId')
  async findAllImpactCoverData(@Param('assessmentId') assessmentId: number) {
    return await this.investorToolService.findAllImpactCoverData(assessmentId);
  }

  @Get('findAllAssessData/:assessmentId')
  async findAllAssessData(@Param('assessmentId') assessmentId: number) {
    return await this.investorToolService.findAllAssessData(assessmentId);
  }

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
