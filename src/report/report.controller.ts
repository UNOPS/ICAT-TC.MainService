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
  UseGuards,
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
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('report')
@ApiTags('report')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly reportGenarateService: ReportGenaratesService,
    private readonly reportHtmlGenarateService: ReportHtmlGenaratesService,
    private readonly assessmentService: AssessmentService,
    private readonly tokenDetails: TokenDetails
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

  @UseGuards(JwtAuthGuard )
  @Post('generate-report')
  async generateReport(
    @Body() req: CreateReportDto,
    @Response() res
  ): Promise<any> {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline;filename=yolo.pdf');
    let countryIdFromTocken: number
    [countryIdFromTocken] =
      this.tokenDetails.getDetails([
        TokenReqestType.countryId,
      ]);

    // const createReportDto = new CreateReportDto();
    // createReportDto.assessmentId = req.assessmentId;
    req.reportTitle = req.reportName
    req.reportName = req.reportName + '.pdf'
    const reprtDto: ReportDto = await this.reportService.genarateReportDto(
      req,
    );
    let report = await this.reportGenarateService.reportGenarate(
      reprtDto.reportName,
      await this.reportHtmlGenarateService.reportHtmlGenarate(reprtDto),
    )
    this.reportService.saveReport(req.reportName, reprtDto.reportName, countryIdFromTocken, req.climateAction.policyName)
    res.send(report)
  }

  @UseGuards(JwtAuthGuard )
  @Get('get-reports')
  async getReportData(
  @Query('climateAction') climateAction: string,
  @Query('reportName') reportName: string,){

    let countryIdFromTocken: number;
    [countryIdFromTocken] = this.tokenDetails.getDetails([TokenReqestType.countryId])

    return await this.reportService.getReports(climateAction, reportName, countryIdFromTocken)
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
    let catagory = [];
    for (let parameter of asssCharac.parameters) {
      // console.log(parameter);
      let cat = catagory.find((a) => a.name == parameter.category.name);
      if (cat) {
        cat.characteristics.push({name:parameter.characteristics.name,relevance:parameter.relevance,comment:parameter.scoreOrInstitutionJusti});
        cat.rows=cat.characteristics.length;
      } else {
        catagory.push({
          rows:1,
          name: parameter.category.name,
          characteristics: [{name:parameter.characteristics.name,relevance:parameter.relevance,comment:parameter.scoreOrInstitutionJusti}],
        });
      }
     
     
    }
    // for(let cat of catagory){
    //   console.log(cat);
    // }
    // console.log("reprtDto",reprtDto)
  }
}
