import { Crud, CrudController } from "@nestjsx/crud";
import { Body, Controller, Get, NotFoundException, Param, Post, Query, Res, ServiceUnavailableException, StreamableFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
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
import { editFileNameForStorage } from "src/document/entity/file-upload.utils";
import { StorageService } from "src/storage/storage.service";
import { StorageFile } from "src/storage/storage-file";


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
    private storageService: StorageService
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
  async saveResult(@Body() req: SaveCMResultDto){
    return await this.service.saveResult(req.result, req.assessment, req.isDraft,req.name,req.type)
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
  @UseInterceptors( FilesInterceptor('files',20 ))
  async uploadJustification(@UploadedFiles() files: Array<Express.Multer.File>
  ) {
 
    const location='uploads/'
console.log(files)
     
      try {
          await this.storageService.save(
            location + files[0].originalname,
            files[0].mimetype,
            files[0].buffer,
            [{ mediaId: files[0].originalname }]
          );
        } catch (e) {
          if (e.message.toString().includes("No such object")) {
            throw new NotFoundException("file not found");
          } else {
            throw new ServiceUnavailableException("internal error");
          }
        }
   
    
    return {fileName: files[0].originalname};
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
