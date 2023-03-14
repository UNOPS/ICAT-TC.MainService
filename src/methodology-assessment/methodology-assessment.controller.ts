import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MethodologyAssessmentService } from './methodology-assessment.service';
import { CreateMethodologyAssessmentDto } from './dto/create-methodology-assessment.dto';
import { UpdateMethodologyAssessmentDto } from './dto/update-methodology-assessment.dto';
import { Methodology } from './entities/methodology.entity';
import { Crud, CrudController } from '@nestjsx/crud';
import { Category } from './entities/category.entity';
import { ApiTags } from '@nestjs/swagger';
import { MethodologyAssessmentParameters } from './entities/methodology-assessment-parameters.entity';
import axios from 'axios';
import { ProjectService } from 'src/climate-action/climate-action.service';
import { AssessmentCharacteristics } from './entities/assessmentcharacteristics.entity';


const MainMethURL = 'http://localhost:7100/methodology/assessmentData';

@ApiTags('methodology-assessment')
@Controller('methodology-assessment')
export class MethodologyAssessmentController {
  

 

  constructor(private readonly methodologyAssessmentService: MethodologyAssessmentService,
    private readonly climateService : ProjectService,
    ) { }

    res2 : number;
    resData :any;

  /*  @Post()
   create(@Body() createMethodologyAssessmentDto: CreateMethodologyAssessmentDto) {
     return this.methodologyAssessmentService.create(createMethodologyAssessmentDto);
   } */

  @Post('methAssignDataSave')
  async methAssignDataSave(@Body() MethAssignParam: MethodologyAssessmentParameters): Promise<any> {
  this.res2 = 0
  this.resData = ''

    const response = await axios.post(MainMethURL, MethAssignParam);
    console.log("resss", response.data)

    this.res2 = await this.methodologyAssessmentService.create(MethAssignParam)
   
    this.resData = {
      result : response.data,
      assesId : this.res2
    }

    return this.resData

  }

  @Post('AssessCharacteristicsDataSave')
  async AssessCharacteristicsDataSave(@Body() AssessCharData: AssessmentCharacteristics): Promise<any> {
 
    let newRes = await this.methodologyAssessmentService.createAssessCharacteristics(AssessCharData)

    return newRes

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

  /*   @Get(':id')
    findOne(@Param('id') id: string) {
      return this.methodologyAssessmentService.findOne(+id);
    } */

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMethodologyAssessmentDto: UpdateMethodologyAssessmentDto) {
    return this.methodologyAssessmentService.update(+id, updateMethodologyAssessmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.methodologyAssessmentService.remove(+id);
  }
}
