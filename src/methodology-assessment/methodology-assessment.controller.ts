import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Request, Query, UseInterceptors, UploadedFile, Req, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { MethodologyAssessmentService } from './methodology-assessment.service';
import { UpdateMethodologyAssessmentDto } from './dto/update-methodology-assessment.dto';
import { CrudRequest } from '@nestjsx/crud';
import { ApiTags } from '@nestjs/swagger';
import { MethodologyAssessmentParameters } from './entities/methodology-assessment-parameters.entity';
import axios from 'axios';
import { AssessmentCharacteristics } from './entities/assessmentcharacteristics.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateValueEnterData } from './dto/updateValueEnterData.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, editFileNameForStorage, fileLocation, fileLocationForStorage } from './entities/file-upload.utils';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import RoleGuard, { LoginRole } from 'src/auth/guards/roles.guard';
import { Results } from './entities/results.entity';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { UsersService } from 'src/users/users.service';
var multer = require('multer');

const auditlogURL = process.env.AUDIT_URL+ '/audit';
import { DataVerifierDto } from 'src/assessment/dto/dataVerifier.dto';
import { AuditDto } from 'src/audit/dto/audit-dto';
import { UpdateIndicatorDto } from './dto/update-indicator.dto';
import { OutcomeCategory } from './dto/outcome-category.dto';
import { GetAssessmentDetailsDto } from './dto/get-assessment-detail.dto';
import { MasterDataService } from 'src/shared/entities/master-data.service';
import { StorageService } from 'src/storage/storage.service';


@ApiTags('methodology-assessment')
@Controller('methodology-assessment')
export class MethodologyAssessmentController {
  originalname: any;
  filename: any;




  constructor(private readonly methodologyAssessmentService: MethodologyAssessmentService,
    private readonly tokenDetails: TokenDetails,
    private readonly userService : UsersService,
    private masterDataService: MasterDataService,
    private storageService: StorageService
  ) {
  }

  res2: number;
  resData: any;
   @UseGuards(JwtAuthGuard)
  @Post('methAssignDataSave')
  async methAssignDataSave(@Body() MethAssignParam: MethodologyAssessmentParameters): Promise<any> {
    this.res2 = 0
    this.resData = ''

    let newData : any = MethAssignParam;
    const response = await axios.post( '/assessmentData', MethAssignParam);

    this.res2 = await this.methodologyAssessmentService.create(MethAssignParam)

    this.resData = {
      result: response.data,
      assesId: this.res2
    }

    if(newData.assessment_approach === 'Direct' && newData.assessment_method === 'Track 1'){

      let result : any = {
        averageProcess : response.data.averageProcess,
        averageOutcome:  response.data.averageOutcome,
        assessment_id :this.res2
      }
  
      await this.methodologyAssessmentService.createResults(result);
    }
  
    if(this.res2){
      let user =  this.userService.userDetailsForAudit();
      let audit2 = {
        description: (await user).userName + " Create Assessment in " + this.masterDataService.getToolName('PORTFOLIO'),
        userName: (await user).userName,
        actionStatus: "Create Assessment",
        userType: (await user).userType,
        uuId: (await user).uuId,
        institutionId: (await user).institutionId,
    }
     
      try {
        const response = axios.post(auditlogURL + '/createCountry' , audit2); 
    } catch (error) {
    }
    }
    

    return this.resData;

  }
  

  @UseGuards(JwtAuthGuard)
  @Post('barrier-characteristics')
  async barrierCharacteristics(@Body() BarrierCharData: AssessmentCharacteristics): Promise<any> {
    this.resData = ''

    let methdata : any = BarrierCharData;

    if(methdata.alldata.assessment_approach === 'Direct'){
      const response = await axios.post( '/assessmentDataTrack3', BarrierCharData);

    let res = await this.methodologyAssessmentService.barrierCharacteristics(BarrierCharData);

    this.resData = {
      result: response.data,
      assesId: res
    }
  

     if(res){
      let user =  this.userService.userDetailsForAudit();
      let audit2 = {
        description: (await user).userName + " Create Assessment in "+ this.masterDataService.getToolName('PORTFOLIO') + " track 2",
        userName: (await user).userName,
        actionStatus: "Create Assessment",
        userType: (await user).userType,
        uuId: (await user).uuId,
        institutionId: (await user).institutionId,
    }
     
      try {
        const response = axios.post(auditlogURL + '/createCountry' , audit2); 
    } catch (error) {
    }
    } 


    let result : any = {
      averageProcess : response.data.averageProcess,
      averageOutcome:  response.data.averageOutcome,
      assessment_id :  res
    }

     this.methodologyAssessmentService.assessCategory(this.resData)

    await this.methodologyAssessmentService.createResults(result)

    return this.resData
    }

    if(methdata.alldata.assessment_approach === 'Indirect'){
      let res = await this.methodologyAssessmentService.barrierCharacteristics(BarrierCharData);
      return res
    }
    

  }

  @Post('barrierCharSave')
  async barrierCharSave(@Body() BarrierCharData: AssessmentCharacteristics): Promise<any> {

    let res = await this.methodologyAssessmentService.barrierCharSave(BarrierCharData);

    return res

  }

 
  @Put('update-institution')
  updateInstitution(
    @Body() updateValueDto: UpdateValueEnterData,
  ): Promise<boolean> {
    return this.methodologyAssessmentService.updateInstitution(updateValueDto);
  }

  @Post('AssessCharacteristicsDataSave')
  async AssessCharacteristicsDataSave(@Body() AssessCharData: AssessmentCharacteristics): Promise<any> {
    let newRes = await this.methodologyAssessmentService.createAssessCharacteristics(AssessCharData);

    return newRes;

  }

  
  @Get('findParam/:assessId')
  async findByAssemeId(@Param('assessId') assessId: number) {
    return await this.methodologyAssessmentService.getparam(assessId);
  }

  @Get('findChar/:assessId')
  async findByAssessIdAndRelevanceNotRelevant(@Param('assessId') assessId: number) {
    return await this.methodologyAssessmentService.findByAssessIdAndRelevanceNotRelevant(assessId);
  }

  @Get('findBarrierData/:assessId')
  async findByAssessIdBarrierData(@Param('assessId') assessId: number) {
    return await this.methodologyAssessmentService.findByAssessIdBarrierData(assessId);
  }


  @Get('getAssessCategory/:assessId')
  async getAssessCategory(@Param('assessId') assessId: number) {
    return await this.methodologyAssessmentService.getAssessCategory(assessId);
  }


  @Get()
  findAllMethodologies() {
    return this.methodologyAssessmentService.findAllMethodologies();
  }

  @Get('findAllBarriers')
  async findAllBarriers() {
    return await this.methodologyAssessmentService.findAllBarriers();
  }

  @Get('findAllBarriersCharacter')
  async findAllBarriersCharacter() {
    return await this.methodologyAssessmentService.findAllBarriersCharacter();
  }

  @UseGuards(JwtAuthGuard)
  @Get('results/:skip/:pageSize/:filterText')
  async getResultPageData(
    @Param('skip') skip: number,
    @Param('pageSize') pageSize: number,
    @Query('filterText') filterText: string,
    @Query('sectorList') sectorList: string,
    @Query('assessmentType') assessmentType: string|undefined) {
    return await this.methodologyAssessmentService.getResultPageData(skip, pageSize, filterText, sectorList, assessmentType);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-assessment-count')
  async getAssessmentCount(){
    return await this.methodologyAssessmentService.getAssessmentCount();
  }
     

  @Get('results')
  async results() {

    return await this.methodologyAssessmentService.results();
  }

  @Get('get-results-by-assessment/:assessmentId')
  async getResultByAssessment(@Param('assessmentId') assessmentId: number) {
    return await this.methodologyAssessmentService.getResultByAssessment(assessmentId);
  }

  @Get('get-assessments-by-climate-action')
  async getAssessmentByClimateAction(@Query('climateActionId') climateActionId: number){
    return await this.methodologyAssessmentService.getAssessmentsByClimateAction(climateActionId);
  }


  @Get('findByAllAssessmentData')
  async findByAllAssessmentData() {
    return await this.methodologyAssessmentService.findByAllAssessmentData();
  }

  @Get('findAssessmentParameters/:assessmentId')
  async findAssessmentParameters(@Param('assessmentId') assessmentId: number){
    return await this.methodologyAssessmentService.findAssessmentParameters(assessmentId);
  }

  @Get('findMethbyName')
  async findMethbyName(@Param('methName') methName: string) {
    return await this.methodologyAssessmentService.findMethbyName(methName);
  }

  

  @Post('uploadtest')
@UseInterceptors(
  FileInterceptor('file',
  //  {
  //   storage: multer.diskStorage({
  //     destination: fileLocation,
  //     filename: editFileName,
  //   }),
  // }
),
)
async uploadFile2(
  @UploadedFile() file,
  @Req() req: CrudRequest,
  @Request() request,
) {


  const fileName=editFileNameForStorage(file);
        const location=fileLocationForStorage()
        try {
            await this.storageService.save(
              location + fileName,
              file.mimetype,
              file.buffer,
              [{ mediaId: fileName }]
            );
          } catch (e) {
            if (e.message.toString().includes("No such object")) {
              throw new NotFoundException("file not found");
            } else {
              throw new ServiceUnavailableException("internal error");
            }
          }
  this.filename = file.filename;
  return { location: `${this.filename}` };
}



  @Get('findByAllAssessmentBarriers')
  async findByAllAssessmentBarriers() {
    return await this.methodologyAssessmentService.findByAllAssessmentBarriers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('AssessmentDetails')
  async AssessmentDetails() {
    return await this.methodologyAssessmentService.AssessmentDetails();
  }

  @UseGuards(JwtAuthGuard)
  @Post('assessment-details-for-tool')
  async AssessmentDetailsforTool(@Body() req: GetAssessmentDetailsDto ): Promise<any[]> {
  let res  = await this.methodologyAssessmentService.AssessmentDetailsforTool(req.tools);
    return res;
   
  }

  @Get('findAllCategories')
  async findAllCategories() {
    return await this.methodologyAssessmentService.findAllCategories();
  }

  @Get('get-all-outcome-characteristics')
  async getAllOutcomeCharacteristics():Promise<OutcomeCategory[]>{
    return await this.methodologyAssessmentService.getAllOutcomeCharacteristics()
  }

  @Get('findByAllCategories')
  async findByAllCategories() {
    return await this.methodologyAssessmentService.findByAllCategories();
  }

  @Get('findAllCharacteristics')
  async findAllCharacteristics() {
    return this.methodologyAssessmentService.findAllCharacteristics();
  }

  @Get('findAllBarrierData/:assessId')
  async findAllBarrierData(@Param('assessId') assessId: number) {
    return await this.methodologyAssessmentService.findAllBarrierData(assessId);
  }

  @Get('assessmentParameters/:assessId')
  async assessmentParameters(@Param('assessId') assessId: number) {
    return await this.methodologyAssessmentService.assessmentParameters(assessId);
  }

  @Get('assessmentData/:assessId')
  async assessmentData(@Param('assessId') assessId: number) {
    return await this.methodologyAssessmentService.assessmentData(assessId);
  }

  @Get('barriesByassessId/:assessId')
  async barriesByassessId(@Param('assessId') assessId: number) {
    return await this.methodologyAssessmentService.barriesByassessId(assessId);
  }

  @Get('findAllIndicators')
  findAllIndicators() {
    return this.methodologyAssessmentService.findAllIndicators();
  }

  @Get('findAllMethIndicators')
  findAllMethIndicators() {
    return this.methodologyAssessmentService.findAllMethIndicators();
  }

  @Get('findAllPolicyBarriers')
  findAllPolicyBarriers() {
    return this.methodologyAssessmentService.findAllPolicyBarriers();
  }

  @Get('findAllObjectives')
  findAllObjectives() {
    return this.methodologyAssessmentService.findAllObjectives();
  }  @Get('findAllMethParameters')
  findAllMethParameters() {
    return this.methodologyAssessmentService.findAllMethParameters();
  }

  @Get('dataCollectionInstitution')
   dataCollectionInstitution() {

    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let userTypeFromTocken: string;
    let institutionTypeId: number;

    [countryIdFromTocken, sectorIdFromTocken, userTypeFromTocken] =
      this.tokenDetails.getDetails([
        TokenReqestType.countryId,
        TokenReqestType.sectorId,
        TokenReqestType.role,
      ]);
 
     return countryIdFromTocken
   } 

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMethodologyAssessmentDto: UpdateMethodologyAssessmentDto) {
    return this.methodologyAssessmentService.update(+id, updateMethodologyAssessmentDto);
  }

  @Patch('update-parameter/:id')
  updateParameter(@Param('id') id: number, @Body() parameter: MethodologyAssessmentParameters){
    return this.methodologyAssessmentService.updateParameter(+id, parameter);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.methodologyAssessmentService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-value')

  updateDeadline(
    @Body() updateValueDto: UpdateValueEnterData,
  ): Promise<boolean> {
    return this.methodologyAssessmentService.updateEnterDataValue(updateValueDto);
  }

  @Get('allParam')
  async allParam(
    @Request() request,   
    @Query('filterText') filterText: string[],   
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) : Promise<any>{ 

    return await this.methodologyAssessmentService.allParam(
      {
        limit: limit,
        page: page,
      },
      filterText,
    )
  }
  @UseGuards(JwtAuthGuard, RoleGuard([LoginRole.COUNTRY_ADMIN]))
  @Get('get-assessments-for-assign-verifier')
  async getAssessmentForAssignVerifier(
    @Request() request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('statusId') statusId: number,
    @Query('filterText') filterText: string,
  ): Promise<any> {

    let countryIdFromTocken: number;
    [countryIdFromTocken, ] = this.tokenDetails.getDetails([TokenReqestType.countryId])
    

    return await this.methodologyAssessmentService.getAssessmentForAssignVerifier(
      {
        limit: limit,
        page: page,
      },
      filterText,
      statusId,
      countryIdFromTocken
    );
  }

 
  @Patch('update-result/:id')
  updateResult(@Param('id') id: number, @Body() result: Results){
    return this.methodologyAssessmentService.updateResult(+id, result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('save-assessment')
  async saveAssessment(@Body() assessment: Assessment){
    return await this.methodologyAssessmentService.saveAssessment(assessment)
  }

  @UseGuards(JwtAuthGuard, RoleGuard([LoginRole.COUNTRY_ADMIN]))
  @Put('update-assign-verifiers')
  async updateAssignVerifiers(
    @Body() updateDeadlineDto: DataVerifierDto,
  ): Promise<boolean> {
      let audit: AuditDto = new AuditDto();
      let paeameter = this.methodologyAssessmentService.acceptDataVerifiersForIds(updateDeadlineDto);
      return paeameter;

  }
  
  @Post('updateIndicatorValue')
  async updateIndicatorValue(@Body() data: UpdateIndicatorDto): Promise<any> {

    let result:any;
    if(data){
      result = await this.methodologyAssessmentService.updateIndicatorValue(data);

      return result;

    }
  

  }


  @Get('getResultForTool/:tool')
  async getResultForTool(@Param('tool') tool: string): Promise<any[]> {
  let res  = await this.methodologyAssessmentService.getResultForTool(tool);
    return res;
   
  }
  @UseGuards(JwtAuthGuard)
  @Get('getTCForTool/:tool')
  async getTCForTool(@Param('tool') tool: string): Promise<any[]> {
  let res  = await this.methodologyAssessmentService.getTCForTool(tool);
    return res;
   
  }
  @Get('get-count-by-tool')
  async getCountByTool(@Param('tool') tool: string): Promise<any[]> {
  let res  = await this.methodologyAssessmentService.getCountByTool();
    return res;
   
  }


}
