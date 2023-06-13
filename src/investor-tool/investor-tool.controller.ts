import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InvestorToolService } from './investor-tool.service';
import { CreateInvestorToolDto } from './dto/create-investor-tool.dto';
import { UpdateInvestorToolDto } from './dto/update-investor-tool.dto';
import { ApiTags } from '@nestjs/swagger';
import { InvestorAssessment } from './entities/investor-assessment.entity';
import { FinalInvestorAssessmentDto } from './dto/final-investor-assessment.dto';
import { InvestorQuestions } from './entities/investor-questions.entity';
import { query } from 'express';

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
  async createinvestorToolAssessment(@Body() createInvestorToolDto: CreateInvestorToolDto) {
    return await this.investorToolService.createinvestorToolAssessment(createInvestorToolDto);
  }


  @Post('createFinalAssessment')
  async createFinalAssessment(@Body() req: FinalInvestorAssessmentDto[]) {
    return await this.investorToolService.createFinalAssessment(req);
  }

  @Post('createFinalAssessmentIndirect')
  createFinalAssessmentIndirect(@Body() req: FinalInvestorAssessmentDto[]) {
    return this.investorToolService.createFinalAssessmentIndirect(req);
  }
  

  @Get('findAllImpactCovered')
  async findAllImpactCovered() {
    return await this.investorToolService.findAllImpactCovered();
  }

  @Get('findAllIndicatorquestions')
  async findAllIndicatorquestions():Promise<InvestorQuestions[]> {
    return await this.investorToolService.findAllIndicatorquestions();
  }

  @Get('findSectorCount')
  async findSectorCount(@Query('tool') tool:string):Promise<any[]> {
    return await this.investorToolService.findSectorCount(tool);
  }
  @Get('getTCValueByAssessment')
  async getTCValueByAssessment(@Query('tool') tool:string):Promise<any[]> {
    return await this.investorToolService.getTCValueByAssessment(tool);
  }

  @Get('calculateAssessmentResults/:tool')
  async calculateAssessmentResults(@Param('tool') tool: string): Promise<any[]> {
  let res  = await this.investorToolService.calculateAssessmentResults(tool);
    return res;
   
  }

  @Get('get-investor-question-by-id')
  async getInvestorQuestionById(@Query('id') id: number){
    return await this.investorToolService.getInvestorQuestionById(id)
  }


}
