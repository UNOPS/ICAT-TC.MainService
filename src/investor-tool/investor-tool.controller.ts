import { Controller, Get, Post, Body, Param,  Query, Put, UseInterceptors, UploadedFile, UploadedFiles, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { InvestorToolService } from './investor-tool.service';
import { CreateInvestorToolDto } from './dto/create-investor-tool.dto';
import { UpdateInvestorToolDto } from './dto/update-investor-tool.dto';
import { ApiTags } from '@nestjs/swagger';
import { FinalInvestorAssessmentDto, SdgPriorityDto, ToolsMultiselectDto, TotalInvestmentDto } from './dto/final-investor-assessment.dto';
import { InvestorQuestions } from './entities/investor-questions.entity';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, excelFileFilter } from 'src/utills/file-upload.utils';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PortfolioQuestions } from './entities/portfolio-questions.entity';
import { AuditDetailService } from 'src/utills/audit_detail.service';
import { MasterDataService } from 'src/shared/entities/master-data.service';

ApiTags('investor-tool')
@Controller('investor-tool')
export class InvestorToolController {
  constructor(
    private readonly investorToolService: InvestorToolService,
    private auditDetailService: AuditDetailService,
    private masterDataService: MasterDataService
  ) { }

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

  @UseGuards(JwtAuthGuard)
  @Post('createFinalAssessment')
  async createFinalAssessment(@Body() req: FinalInvestorAssessmentDto) {
    let details = await this.auditDetailService.getAuditDetails()
    let tool = this.masterDataService.getToolName('INVESTOR')
    let obj = {
      description: req.isEdit ? 'Edit assessment: ' + tool : (req.isDraft ? 'Save draft : ' + tool : 'Create assessment : ' + tool)
    }
    let body = { ...details, ...obj }
    try {
      body = { ...body, ...{ actionStatus: req.isEdit ? 'Edited successfully' : (req.isDraft ? 'Saved draft successfully' : 'Created assessment successfully') } }
      this.auditDetailService.log(body)
      return await this.investorToolService.createFinalAssessment(req);  
    } catch(error) {
      body = { ...body, ...{ actionStatus: req.isEdit ? 'Failed to edit' : (req.isDraft ? 'Failed to saved draft' : 'Failed to created assessment') } }
      this.auditDetailService.log(body)
      throw new InternalServerErrorException()
    } 
  }

  @UseGuards(JwtAuthGuard)
  @Post('createFinalAssessment2')
  async createFinalAssessment2(@Body() req: FinalInvestorAssessmentDto) {
    let details = await this.auditDetailService.getAuditDetails()
    let tool = this.masterDataService.getToolName('PORTFOLIO')
    let obj = {
      description: req.isEdit ? 'Edit assessment: ' + tool : (req.isDraft ? 'Save draft : ' + tool : 'Create assessment : ' + tool)
    }
    let body = { ...details, ...obj }
    try {
      body = { ...body, ...{ actionStatus: req.isEdit ? 'Edited successfully' : (req.isDraft ? 'Saved draft successfully' : 'Created assessment successfully') } }
      this.auditDetailService.log(body)
      return await this.investorToolService.createFinalAssessment2(req);  
    } catch(error) {
      body = { ...body, ...{ actionStatus: req.isEdit ? 'Failed to edit' : (req.isDraft ? 'Failed to saved draft' : 'Failed to created assessment') } }
      this.auditDetailService.log(body)
      throw new InternalServerErrorException()
    } 
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

    return await this.investorToolService.findSectorCount(tool);
  }

  @UseGuards(JwtAuthGuard)
  @Get('find-sector-count-all-tool')
  async findSectorCountAllTool(
    @Query('portfolioId') portfolioId: number 
    ):Promise<any[]> {

      return await this.investorToolService.findAllSectorCount(portfolioId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('getTCValueByAssessment')
  async getTCValueByAssessment(@Query('tool') tool:string):Promise<any[]> {
    return await this.investorToolService.getTCValueByAssessment(tool);
  }
  @UseGuards(JwtAuthGuard)
  @Get('getSectorCountByTool/:tool')
  async getSectorCountByTool(@Param('tool') tool:string){
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
    let res =  await this.investorToolService.calculateNewAssessmentResults(assessID);
    return res;

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
  @UseInterceptors( FilesInterceptor('files',20))
  async uploadJustification(@UploadedFiles() files: Array<Express.Multer.File>
  ) {
    return {fileName: files[0].filename}
  }

  @Post('upload-file-investment')
  @UseInterceptors( FilesInterceptor('files',20))
  async uploadJustificationInvestment(@UploadedFiles() files: Array<Express.Multer.File>
  ) {
    return {fileName: files[0].filename}
  }
  @UseGuards(JwtAuthGuard)
  @Get('sdgSumCalculateInvester/:tool')
  async sdgSumCalculate(@Param('tool') tool: string) {
    return await this.investorToolService.sdgSumCalculate(tool);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sdgSumAllCalculateInvester')
  async sdgSumAllCalculate(
    @Query('portfolioId') portfolioId: number
  ) {
    return await this.investorToolService.sdgSumALLCalculate(portfolioId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard-data')
  async getDashboardData(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('selectedAssessIds') selectedAssessIds: number[]
    ):Promise<any> {
    return await this.investorToolService.getDashboardData( {
      limit: limit,
      page: page,
    },selectedAssessIds);
  }

  @Post('save-tool-multiselect')
  async saveToolsMultiSelect(@Body() req: ToolsMultiselectDto){
    return await this.investorToolService.saveToolsMultiSelect(req)
  }
  @UseGuards(JwtAuthGuard)
  @Get('dashboard-all-data-graph') 
  async getDashboardAllDataGraph(
    ):Promise<any> {
      return this.investorToolService.getDashboardAllDataGraph();
    }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard-all-data/:skip/:pageSize')
  async getDashboardAllData(
    @Param('skip') skip: number,
    @Param('pageSize') pageSize: number,
    @Query('filterText') filterText: [],
    @Query('PortfolioID') PortfolioID: number,
    ):Promise<any> {
    return await this.investorToolService.getDashboardAllData( skip, pageSize, filterText,PortfolioID);
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard-all-filter/:skip/:pageSize')
  async getDashboardAllDatafilter(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterText') filterText: [],
    @Query('PortfolioID') PortfolioID: number,
    ):Promise<any> { 
    return await this.investorToolService.getDashboardAllDataFilter( {page,limit},  filterText,PortfolioID);
  }

  @UseGuards(JwtAuthGuard)
  @Post('save-sdg-priorities')
  async saveSdgPriorities(@Body() req: SdgPriorityDto) {

    let details = await this.auditDetailService.getAuditDetails()
    let obj = {
      description: "Save SDG priorities"
    }
    let body = { ...details, ...obj }
    try {
      body = { ...body, ...{ actionStatus: "Saved SDG Priorities", } }
      this.auditDetailService.log(body)
      return await this.investorToolService.saveSdgPriorities(req.priorities)
    } catch (error) {
      body = { ...body, ...{ actionStatus: "Failed to save SDG Priorities", } }
      this.auditDetailService.log(body)
      throw new InternalServerErrorException(error)
    }
  }

  @Get('get-priorities-by-country/:id')
  async getSdgPrioritiesByCountryId(@Param('id') id: number){
    return await this.investorToolService.getSdgPrioritiesByCountryId(id)
  }

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

  @Post('save-total-invetments')
  async saveTotalInvestments(@Body() req: TotalInvestmentDto){
    return await this.investorToolService.saveTotalInvestments(req.totalInvestements)
  }

  


}
