import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Response,
  Query,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportGenaratesService } from './report-genarates/report-genarates.service';
import { ReportHtmlGenaratesService } from './report-html-genarates/report-html-genarates.service';
import { ReportDto } from './dto/report.dto';
import { ApiTags } from '@nestjs/swagger';
import { AssessmentDto } from './dto/assessment.dto';
import { AssessmentService } from 'src/assessment/assessment.service';

@Controller('report')
@ApiTags('report')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly reportGenarateService: ReportGenaratesService,
    private readonly reportHtmlGenarateService: ReportHtmlGenaratesService,
    private readonly assessmentService: AssessmentService,
  ) {}

  @Post()
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportService.create(createReportDto);
  }

  @Get()
  findAll() {
    return this.reportService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   console.log("test1");
  //   return this.reportService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportService.update(+id, updateReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportService.remove(+id);
  }

  @Get('reportPDF')
  async getReport(@Response() res): Promise<any> {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline;filename=yolo.pdf');

    const createReportDto = new CreateReportDto();
    createReportDto.assessmentId = 338;
    const reprtDto: ReportDto = await this.reportService.genarateReportDto(
      createReportDto,
    );
    return res.send(
      await this.reportGenarateService.reportGenarate(
        reprtDto.reportName,
        await this.reportHtmlGenarateService.reportHtmlGenarate(reprtDto),
      ),
    );
  }

  @Get('assessmentPDF')
  async getAssessment(@Response() res): Promise<any> {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline;filename=yolo.pdf');

    const assessmentDto: AssessmentDto =
      this.reportService.genarateAssessmentDto();
    return res.send(
      await this.reportGenarateService.assessmentGenarate(
        'assessmentPDF.pdf',
        await this.reportHtmlGenarateService.assessmentHtmlGenarate(
          assessmentDto,
        ),
      ),
    );
  }

  @Get('test/ReportDto')
  async testReportDto(@Query('id') id: number): Promise<any> {
    // console.log("reprtDto",id)
    const createReportDto = new CreateReportDto();
    createReportDto.assessmentId = 338;
    // const reprtDto:ReportDto= await this.reportService.genarateReportDto(createReportDto);
    // this.assessmentService.getCharacteristicasforReport(338,"")
    // console.log("reprtDto",await this.assessmentService.getCharacteristicasforReport(338,""))
    let asssCharac = await this.assessmentService.getCharacteristicasforReport(
      id,
      'outcome',''
    );
    console.log(asssCharac.parameters);
    // let catagory = [];
    // for (let parameter of asssCharac.parameters) {
    //   // console.log(parameter);
    //   let cat = catagory.find((a) => a.name == parameter.category.name);
    //   if (cat) {
    //     cat.characteristics.push({name:parameter.characteristics.name,relevance:parameter.relevance,comment:parameter.scoreOrInstitutionJusti});
    //     cat.rows=cat.characteristics.length;
    //   } else {
    //     catagory.push({
    //       rows:1,
    //       name: parameter.category.name,
    //       characteristics: [{name:parameter.characteristics.name,relevance:parameter.relevance,comment:parameter.scoreOrInstitutionJusti}],
    //     });
    //   }
     
     
    // }
    // for(let cat of catagory){
    //   console.log(cat);
    // }
    // console.log("reprtDto",reprtDto)
  }
}
