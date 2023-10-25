import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseInterceptors, UploadedFile, UploadedFiles, UseGuards } from '@nestjs/common';
import { InvestorToolService } from './investor-tool.service';
import { CreateInvestorToolDto } from './dto/create-investor-tool.dto';
import { UpdateInvestorToolDto } from './dto/update-investor-tool.dto';
import { ApiTags } from '@nestjs/swagger';
import { InvestorAssessment } from './entities/investor-assessment.entity';
import { FinalInvestorAssessmentDto, SdgPriorityDto, ToolsMultiselectDto } from './dto/final-investor-assessment.dto';
import { InvestorQuestions } from './entities/investor-questions.entity';
import { query } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, excelFileFilter } from 'src/utills/file-upload.utils';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PortfolioQuestions } from './entities/portfolio-questions.entity';
import { PortfolioSdg } from './entities/portfolio-sdg.entity';

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

  @Get('findAllGeographicalAreaData/:assessmentId')
  async findAllGeographicalAreaData(@Param('assessmentId') assessmentId: number) {
    return await this.investorToolService.findAllGeographicalAreaData(assessmentId);
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

  @Post('createFinalAssessment2')
  async createFinalAssessment2(@Body() req: FinalInvestorAssessmentDto[]) {
      return await this.investorToolService.createFinalAssessment2(req);
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

  @Get('findAllPortfolioquestions')
  async findAllPortfolioquestions():Promise<PortfolioQuestions[]> {
    return await this.investorToolService.findAllPortfolioquestions();
  }

  @UseGuards(JwtAuthGuard)
  @Get('findSectorCount')
  async findSectorCount(@Query('tool') tool:string):Promise<any[]> {

    if(tool =="All Option"){
      return await this.investorToolService.findAllSectorCount();
    }
    return await this.investorToolService.findSectorCount(tool);
  }
  @UseGuards(JwtAuthGuard)
  @Get('getTCValueByAssessment')
  async getTCValueByAssessment(@Query('tool') tool:string):Promise<any[]> {
    return await this.investorToolService.getTCValueByAssessment(tool);
  }
  @UseGuards(JwtAuthGuard)
  @Get('getSectorCountByTool/:tool')
  async getSectorCountByTool(@Param('tool') tool:string){
    // console.log(tool)
    return await this.investorToolService.getSectorCountByTool(tool);
  }

  @UseGuards(JwtAuthGuard)
  @Get('calculateAssessmentResults/:tool')
  async calculateAssessmentResults(@Param('tool') tool: string): Promise<any[]> {
  let res  = await this.investorToolService.calculateAssessmentResults(tool);
    return res;

  }
  
  @UseGuards(JwtAuthGuard)
  @Get('calculate-final-result')
  async calculateFinalResults(@Query('assessID') assessID: number) {
    // console.log("ssss",assessID)
    let res =  await this.investorToolService.calculateNewAssessmentResults(assessID);
    // console.log("res",res)
    return res;
  //  res;

  }
  @Get('get-investor-question-by-id')
  async getInvestorQuestionById(@Query('id') id: number){
    return await this.investorToolService.getInvestorQuestionById(id)
  }

  @Put('update-investor-assessmnet')
  async updateInvestorAssessment(@Body() req: UpdateInvestorToolDto){
    return await this.investorToolService.updateInvestorAssessment(req)
  }


  @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: editFileName,
            }),
            fileFilter: excelFileFilter,
        }),
    )
    async uploadFileExcel(@UploadedFile() file) {
        console.log("====file++++",file);
        const newSavedfile = file.filename;
        await this.investorToolService.uplaodFileUpload(newSavedfile);
    }


    @Get('findAllSDGs')
  async findAllSDGs():Promise<any[]> {
    return await this.investorToolService.findAllSDGs();
  }

  @Get('findSDGs/:assessId')
  async findSDGs(@Param('assessId') assessId: number) {
    return await this.investorToolService.findSDGs(assessId);
  }


  @Post('upload-file')
  @UseInterceptors( FilesInterceptor('files',20, { storage: diskStorage({destination: '/home/ubuntu/code/Main/main/public/uploads',filename: editFileName})}),)
  async uploadJustification(@UploadedFiles() files: Array<Express.Multer.File>
  ) {
    return {fileName: files[0].filename}
    // let savedFiles = await Promise.all(files.map(file => this.saveFile(file)));
  }

  @Post('upload-file-investment')
  @UseInterceptors( FilesInterceptor('files',20, { storage: diskStorage({destination: '/home/ubuntu/code/Main/main/public/uploads',filename: editFileName})}),)
  async uploadJustificationInvestment(@UploadedFiles() files: Array<Express.Multer.File>
  ) {
    return {fileName: files[0].filename}
    // let savedFiles = await Promise.all(files.map(file => this.saveFile(file)));
  }
  @UseGuards(JwtAuthGuard)
  @Get('sdgSumCalculateInvester/:tool')
  async sdgSumCalculate(@Param('tool') tool: string) {
    return await this.investorToolService.sdgSumCalculate(tool);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sdgSumAllCalculateInvester')
  async sdgSumAllCalculate() {
    return await this.investorToolService.sdgSumALLCalculate();
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard-data')
  async getDashboardData(
    @Query('page') page: number,
    @Query('limit') limit: number
    ):Promise<any> {
    return await this.investorToolService.getDashboardData( {
      limit: limit,
      page: page,
    },);
  }

  @Post('save-tool-multiselect')
  async saveToolsMultiSelect(@Body() req: ToolsMultiselectDto){
    return await this.investorToolService.saveToolsMultiSelect(req)
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('dashboard-all-data')
  async getDashboardAllData(
    @Query('page') page: number,
    @Query('limit') limit: number
    ):Promise<any> {
    return await this.investorToolService.getDashboardAllData( {
      limit: limit,
      page: page,
    },);
  }

  @Post('save-sdg-priorities')
  async saveSdgPriorities(@Body() req: SdgPriorityDto){
    return await this.investorToolService.saveSdgPriorities(req.priorities)
  }

  @Get('get-priorities-by-country/:id')
  async getSdgPrioritiesByCountryId(@Param('id') id: number){
    return await this.investorToolService.getSdgPrioritiesByCountryId(id)
  }

  // @UseGuards(JwtAuthGuard)
  @Get('get-processData')
  async getProcessData(@Query('assessID') assessID: number) {
    let res =  await this.investorToolService.getProcessData(assessID);
    return res;

  }

  @Get('get-outcomeData')
  async getOutcomeData(@Query('assessID') assessID: number) {
    let res =  await this.investorToolService.getOutcomeData(assessID);
    return res;

  }

  @Get('get-sdgs')
  async getSelectedSDGs(@Query('assessID') assessID: number) {
    let res =  await this.investorToolService.getSelectedSDGs(assessID);
    return res;

  }

  @Get('getScaleSDGData')
  async getScaleSDGData(@Query('assessID') assessID: number) {
    let res =  await this.investorToolService.getScaleSDGData(assessID);
    return res;

  }

  @Get('getSustainedSDGData')
  async getSustainedSDGData(@Query('assessID') assessID: number) {
    let res =  await this.investorToolService.getSustainedSDGData(assessID);
    return res;

  }

  @Get('getSelectedSDGsWithAnswers')
  async getSelectedSDGsWithAnswers(@Query('assessID') assessID: number) {
    let res =  await this.investorToolService.getSelectedSDGsWithAnswers(assessID);
    return res;

  }


}
