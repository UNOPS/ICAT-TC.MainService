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


const MainMethURL = 'http://localhost:7100/methodology/assessmentData';

@ApiTags('methodology-assessment')
@Controller('methodology-assessment')
export class MethodologyAssessmentController {

 

  constructor(private readonly methodologyAssessmentService: MethodologyAssessmentService,
    private readonly climateService : ProjectService,
    ) { }

  /*  @Post()
   create(@Body() createMethodologyAssessmentDto: CreateMethodologyAssessmentDto) {
     return this.methodologyAssessmentService.create(createMethodologyAssessmentDto);
   } */

  @Post('methAssignDataSave')
  async methAssignDataSave(@Body() MethAssignParam: MethodologyAssessmentParameters): Promise<any> {


    const response = await axios.post(MainMethURL, MethAssignParam);
    console.log("resss", response.data)

    let res = this.methodologyAssessmentService.create(MethAssignParam)
    return response.data
  }

  /*   @Get()
    findAll() {
      return this.methodologyAssessmentService.findAll();
    } */

  @Get()
  findAllMethodologies() {
    return this.methodologyAssessmentService.findAllMethodologies();
  }
  

  @Get('findAllCategories')
  findAllCategories() {
    return this.methodologyAssessmentService.findAllCategories();
  }






  @Get('findAllCharacteristics')
  findAllCharacteristics() {
    return this.methodologyAssessmentService.findAllCharacteristics();
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
