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
  Res,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateComparisonReportDto, CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportGenaratesService } from './report-genarates/report-genarates.service';
import { ReportHtmlGenaratesService } from './report-html-genarates/report-html-genarates.service';
import { ComparisonReportDto, ReportCarbonMarketDto, ReportDto } from './dto/report.dto';
import { ApiTags } from '@nestjs/swagger';
import { AssessmentDto } from './dto/assessment.dto';
import { AssessmentService } from 'src/assessment/assessment.service';
import { TokenDetails, TokenReqestType } from 'src/utills/token_details';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { StorageService } from 'src/storage/storage.service';
import { promises as fsPromises } from 'fs';
@Controller('report')
@ApiTags('report')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly reportGenarateService: ReportGenaratesService,
    private readonly reportHtmlGenarateService: ReportHtmlGenaratesService,
    private readonly assessmentService: AssessmentService,
    private readonly tokenDetails: TokenDetails,
    private storageService: StorageService
  ) { }

  @Post()
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportService.create(createReportDto);
  }

  @Get()
  findAll() {
    return this.reportService.findAll();
  }

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
    createReportDto.assessmentId = 13;
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


  @UseGuards(JwtAuthGuard)
  @Post('generate-report')
  async generateReport(
    @Body() req: CreateReportDto
  ): Promise<any> {
    let countryIdFromTocken: number;
    let UsernnameFromTocken: string;
    [countryIdFromTocken,UsernnameFromTocken] =
      this.tokenDetails.getDetails([
        TokenReqestType.countryId,TokenReqestType.username
      ]);
    req.reportTitle = req.reportName
   
    const randomName = Array(8)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
    const uniqname = req.reportName+randomName + '.pdf'
    req.reportName = req.reportName+ '.pdf'
   
    if(req.tool=='Carbon Market Tool'){
      const reprtDto: ReportCarbonMarketDto = await this.reportService.genarateReportCarbonMarketDto(
        req,
      );
      const report = await this.reportGenarateService.reportGenarate(
        uniqname,
        await this.reportHtmlGenarateService.reportCarbonMarketHtmlGenarate(reprtDto),
      )

    }else{
      const reprtDto: ReportDto = await this.reportService.genarateReportDto(
        req,
      );
      const report = await this.reportGenarateService.reportGenarate(
        uniqname,
        await this.reportHtmlGenarateService.reportHtmlGenarate(reprtDto),
      )
    }
    const filePath = `./public/${uniqname}`;
      
       
    try {
    const fileContent =await fsPromises.readFile(filePath);
   
      await this.storageService.save(
        'reports/' + uniqname,
        'application/pdf',
        fileContent,
        [{ mediaId: uniqname }]
      );
    } catch (e) {
      if (e.message.toString().includes("No such object")) {
        throw new NotFoundException("file not found");
      } else {
        throw new ServiceUnavailableException("internal error");
      }
    }
  
    const response = await this.reportService.saveReport(req.reportName,uniqname, UsernnameFromTocken, req.climateAction,0,req.tool,req.type)
    return response
  }

  @UseGuards(JwtAuthGuard)
  @Post('generate-comparisonreport')
  async generateComparisonReport(
    @Body() req: CreateComparisonReportDto,
    @Res({ passthrough: true }) res, 
  ): Promise<any> {
    let countryIdFromTocken: number;
    let UsernnameFromTocken: string;
    [countryIdFromTocken,UsernnameFromTocken] =
      this.tokenDetails.getDetails([
        TokenReqestType.countryId,TokenReqestType.username
      ]);
    req.reportTitle = req.reportTitle

    const randomName = Array(8)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
    const uniqname = req.reportName+randomName + '.pdf';
    req.reportName = req.reportName + '.pdf';
    const reprtDto: ComparisonReportDto = await this.reportService.genarateComparisonReportDto(
      req,
    );

   const reportpdf = await this.reportGenarateService.comparisonReportGenarate(
    uniqname,
      await this.reportHtmlGenarateService.comparisonReportHtmlGenarate(reprtDto),
    )

    const filePath = `./public/${uniqname}`;
      
       
    try {
    const fileContent =await fsPromises.readFile(filePath);
   
      await this.storageService.save(
        'reports/' + uniqname,
        'application/pdf',
        fileContent,
        [{ mediaId: uniqname }]
      );
    } catch (e) {
      if (e.message.toString().includes("No such object")) {
        throw new NotFoundException("file not found");
      } else {
        throw new ServiceUnavailableException("internal error");
      }
    }

    let report=  await this.reportService.saveReport(req.reportName,uniqname, UsernnameFromTocken, req.climateAction,req.portfolioId,req.tool,req.type);
   
    return report;
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-reports')
  async getReportData(
    @Query('climateAction') climateAction: string,
    @Query('reportName') reportName: string,
    @Query('type') type: string,
    @Query('tool') tool: string,) {

    let countryIdFromTocken: number;
    [countryIdFromTocken] = this.tokenDetails.getDetails([TokenReqestType.countryId])

    return await this.reportService.getReports(climateAction, reportName, countryIdFromTocken,type,tool);
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
    const createReportDto = new CreateReportDto();
    createReportDto.assessmentId = 13;
    let asssCharac = await this.assessmentService.getCharacteristicasforReport(
      id,
      'outcome', '',''
    );
    let catagory = [];
    for (let parameter of asssCharac.parameters) {
      let cat = catagory.find((a) => a.name == parameter.category.name);
      if (cat) {
        cat.characteristics.push({ name: parameter.characteristics.name, relevance: parameter.relevance, comment: parameter.scoreOrInstitutionJusti });
        cat.rows = cat.characteristics.length;
      } else {
        catagory.push({
          rows: 1,
          name: parameter.category.name,
          characteristics: [{ name: parameter.characteristics.name, relevance: parameter.relevance, comment: parameter.scoreOrInstitutionJusti }],
        });
      }
    }
  }

  @Get('test/pageissue')
  async testpageissue(): Promise<any> {

  let {}= this.test() 

  }

  test():{name:string,value:string}{
   return {name:"test",value:"234"}
  }
}
