import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Request, Query, UseInterceptors, UploadedFile, Req, Res } from '@nestjs/common';
import { MethodologyAssessmentService } from './methodology-assessment.service';
import { CreateMethodologyAssessmentDto } from './dto/create-methodology-assessment.dto';
import { UpdateMethodologyAssessmentDto } from './dto/update-methodology-assessment.dto';
import { Methodology } from './entities/methodology.entity';
import { Crud, CrudController, CrudRequest } from '@nestjsx/crud';
import { Category } from './entities/category.entity';
import { ApiTags } from '@nestjs/swagger';
import { MethodologyAssessmentParameters } from './entities/methodology-assessment-parameters.entity';
import axios from 'axios';
import { ProjectService } from 'src/climate-action/climate-action.service';
import { AssessmentCharacteristics } from './entities/assessmentcharacteristics.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateValueEnterData } from './dto/updateValueEnterData.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, fileLocation } from './entities/file-upload.utils';
import { Response } from 'express';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { Results } from './entities/results.entity';
var multer = require('multer');

const MainMethURL = 'http://localhost:7100/methodology';

@ApiTags('methodology-assessment')
@Controller('methodology-assessment')
export class MethodologyAssessmentController {
  originalname: any;
  filename: any;




  constructor(private readonly methodologyAssessmentService: MethodologyAssessmentService,
    private readonly climateService: ProjectService,
    private readonly tokenDetails: TokenDetails,

  ) {
  }

  res2: number;
  resData: any;

  /*  @Post()
   create(@Body() createMethodologyAssessmentDto: CreateMethodologyAssessmentDto) {
     return this.methodologyAssessmentService.create(createMethodologyAssessmentDto);
   } */

  @Post('methAssignDataSave')
  async methAssignDataSave(@Body() MethAssignParam: MethodologyAssessmentParameters): Promise<any> {
    this.res2 = 0
    this.resData = ''

    let newData : any = MethAssignParam

    const response = await axios.post(MainMethURL + '/assessmentData', MethAssignParam);
    console.log("resss", response.data)

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
  
      await this.methodologyAssessmentService.createResults(result)
    }
  
    
    console.log("resData", this.resData)

    return this.resData

  }
  


  @Post('barrier-characteristics')
  async barrierCharacteristics(@Body() BarrierCharData: AssessmentCharacteristics): Promise<any> {
    this.resData = ''

    let methdata : any = BarrierCharData

    console.log("methdata : ", methdata)

    if(methdata.alldata.assessment_approach === 'Direct'){

      const response = await axios.post(MainMethURL + '/assessmentDataTrack3', BarrierCharData);
    console.log("reeesss", response.data)

    let res = await this.methodologyAssessmentService.barrierCharacteristics(BarrierCharData)

    this.resData = {
      result: response.data,
      assesId: res
    }

    let result : any = {
      averageProcess : response.data.averageProcess,
      averageOutcome:  response.data.averageOutcome,
      assessment_id :  res
    }

    await this.methodologyAssessmentService.createResults(result)

    return this.resData
    }

    if(methdata.alldata.assessment_approach === 'Indirect'){
      let res = await this.methodologyAssessmentService.barrierCharacteristics(BarrierCharData)
      console.log("resssID : ", res)
      return res
    }
    

  }

  @Post('barrierCharSave')
  async barrierCharSave(@Body() BarrierCharData: AssessmentCharacteristics): Promise<any> {

    let res = await this.methodologyAssessmentService.barrierCharSave(BarrierCharData)

    return res

  }

 
  @Put('update-institution')
  updateInstitution(
    @Body() updateValueDto: UpdateValueEnterData,
  ): Promise<boolean> {
    console.log("++++++++++++++++++++++++++++++++++++",updateValueDto)
    return this.methodologyAssessmentService.updateInstitution(updateValueDto);
  }

  @Post('AssessCharacteristicsDataSave')
  async AssessCharacteristicsDataSave(@Body() AssessCharData: AssessmentCharacteristics): Promise<any> {

    let newRes = await this.methodologyAssessmentService.createAssessCharacteristics(AssessCharData)

    return newRes

  }


  
  @Get('findParam/:assessId')
  async findByAssemeId(@Param('assessId') assessId: number) {
    return await this.methodologyAssessmentService.getparam(assessId);
  }

  @Get('findChar/:assessId')
  async findByAssessIdAndRelevanceNotRelevant(@Param('assessId') assessId: number) {
    return await this.methodologyAssessmentService.findByAssessIdAndRelevanceNotRelevant(assessId);
  }

  /*   @Get()
    findAll() {
      return this.methodologyAssessmentService.findAll();
    } */

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

  @Get('results')
  async results() {
    return await this.methodologyAssessmentService.results();
  }

  @Get('get-results-by-assessment/:assessmentId')
  async getResultByAssessment(@Param('assessmentId') assessmentId: number) {
    return await this.methodologyAssessmentService.getResultByAssessment(assessmentId);
  }


  @Get('findByAllAssessmentData')
  async findByAllAssessmentData() {
    return await this.methodologyAssessmentService.findByAllAssessmentData();
  }

  @Get('findAssessmentParameters/:assessmentId')
  async findAssessmentParameters(@Param('assessmentId') assessmentId: number){
    return await this.methodologyAssessmentService.findAssessmentParameters(assessmentId)
  }

  @Post('uploadtest')
@UseInterceptors(
  FileInterceptor('file', {
    storage: multer.diskStorage({
      destination: fileLocation,
      filename: editFileName,
    }),
  }),
)
async uploadFile2(
  @UploadedFile() file,
  @Req() req: CrudRequest,
  @Request() request,
) {
  console.log("file")
  console.log(file)
  this.filename = file.filename
  console.log("xxx" + this.filename)
  return { location: `${this.filename}` }
}



  @Get('findByAllAssessmentBarriers')
  async findByAllAssessmentBarriers() {
    return await this.methodologyAssessmentService.findByAllAssessmentBarriers();
  }

  @Get('AssessmentDetails')
  async AssessmentDetails() {
    return await this.methodologyAssessmentService.AssessmentDetails();
  }


  @Get('findAllCategories')
  async findAllCategories() {
    return await this.methodologyAssessmentService.findAllCategories();
  }

  @Get('findByAllCategories')
  async findByAllCategories() {
    return await this.methodologyAssessmentService.findByAllCategories();
  }

  @Get('findAllCharacteristics')
  findAllCharacteristics() {
    return this.methodologyAssessmentService.findAllCharacteristics();
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



  @Get('dataCollectionInstitution')
   dataCollectionInstitution() {

    let countryIdFromTocken: number;
    let sectorIdFromTocken: number;
    let userTypeFromTocken: string;
    let institutionTypeId: number; //instypeId

    [countryIdFromTocken, sectorIdFromTocken, userTypeFromTocken] =
      this.tokenDetails.getDetails([
        TokenReqestType.countryId,
        TokenReqestType.sectorId,
        TokenReqestType.role,
      ]);

      console.log("ammmm :", countryIdFromTocken)
 
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

  @Patch('update-result/:id')
  updateResult(@Param('id') id: number, @Body() result: Results){
    return this.methodologyAssessmentService.updateResult(+id, result);
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
    // let audit: AuditDto = new AuditDto();
    // audit.action = 'Review Data Updated';
    // audit.comment = updateValueDto.value + ' Updated';
    // audit.actionStatus = 'Updated';

    // this.auditService.create(audit);
    console.log(updateValueDto);
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
}
