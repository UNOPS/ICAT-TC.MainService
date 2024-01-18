import { Crud, CrudController } from "@nestjsx/crud";
import { Body, Controller, Get, InternalServerErrorException, Param, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { CMAssessmentQuestion } from "../entity/cm-assessment-question.entity";
import { CMAssessmentQuestionService } from "../service/cm-assessment-question.service";
import { CMResultDto, CMScoreDto, CalculateDto, SaveCMResultDto } from "../dto/cm-result.dto";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { LocalAuthGuard } from "src/auth/guards/local-auth.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { editFileName } from "src/utills/file-upload.utils";
import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { AuditDetailService } from "src/utills/audit_detail.service";
import { MasterDataService } from "src/shared/entities/master-data.service";


@Crud({
  model: {
    type: CMAssessmentQuestion,
  },
  query: {
    join: {
      assessment: {
        eager: true,
        exclude: ['id']
      },
      question: {
        eager: true,
        exclude: ['id']
      }
    },
    exclude: ['id']
  },
})
@Controller('cm-assessment-question')
export class CMAssessmentQuestionController implements CrudController<CMAssessmentQuestion>
{
  constructor(
    public service: CMAssessmentQuestionService,
    @InjectRepository(CMAssessmentQuestion)
    public cMAssessmentQuestionRepo: Repository<CMAssessmentQuestion>,
    private auditDetailService: AuditDetailService,
    private masterDataService: MasterDataService
  ) { }

  get base(): CrudController<CMAssessmentQuestion> {
    return this;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async save(@Body() assessmentQuestion: CMAssessmentQuestion){
    return await this.service.create(assessmentQuestion)
  }

  @UseGuards(JwtAuthGuard)
  @Post('save-result')
  async saveResult(@Body() req: SaveCMResultDto) {
    let details = await this.auditDetailService.getAuditDetails()
    let tool = this.masterDataService.getToolName('CARBON_MARKET')
    let obj = {
      description: req.isDraft ? 'Save draft assessment : ' + tool : 'Create assessment : ' + tool
    }
    let body = { ...details, ...obj }
    try {
      body = { ...body, ...{ actionStatus:req.isDraft ? 'Saved draft successfully' : 'Created assessment successfully', } }
      this.auditDetailService.log(body)
      return await this.service.saveResult(req.result, req.assessment, req.isDraft, req.name, req.type)
    } catch (error) {
      body = { ...body, ...{ actionStatus:req.isDraft ? 'Failed to save draft' : 'Failed to create assessment', } }
      this.auditDetailService.log(body)
      throw new InternalServerErrorException(error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('calculate')
  async calculateResult(@Body() req: CalculateDto): Promise<CMScoreDto>{
    return await this.service.calculateResult(req.assessmentId)
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-result')
  async getResults(@Query('assessmentId') assessmentId: number): Promise<any>{
    return await this.service.getResults(assessmentId)
  }


  @Post('upload-file')
  @UseInterceptors( FilesInterceptor('files',20, { storage: diskStorage({destination: '/home/ubuntu/code/Main/main/public/uploads',filename: editFileName})}),)
  async uploadJustification(@UploadedFiles() files: Array<Express.Multer.File>
  ) {
    return {fileName: files[0].filename};
  }
  @UseGuards(JwtAuthGuard)
  @Get('dashboard-data')
  async getDashboardData(
    @Query('page') page: number,
    @Query('limit') limit: number
    ):Promise<any> {
    return await this.service.getDashboardData( {
      limit: limit,
      page: page,
    },);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-sdg-frequency')
  async getSDGFrequency(): Promise<any>{
    return await this.service.getSDGFrequency()
  }

  @Get('get-assessment-questions-by-assessment-id/:id')
  async getAssessmentQuestionsByAssessmentId(@Param('id') id: number) {
    return await this.service.getAssessmentQuestionsByAssessmentId(id)
  }
  

}
