import { Crud, CrudController } from "@nestjsx/crud";
import { Body, Controller, Get, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { CMAssessmentQuestion } from "../entity/cm-assessment-question.entity";
import { CMAssessmentQuestionService } from "../service/cm-assessment-question.service";
import { CMResultDto, CMScoreDto, CalculateDto, SaveCMResultDto } from "../dto/cm-result.dto";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { LocalAuthGuard } from "src/auth/guards/local-auth.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { editFileName } from "src/utills/file-upload.utils";


@Crud({
  model: {
    type: CMAssessmentQuestion,
  },
  query: {
    join: {
      assessment: {eager: true},
      question: {eager: true}
    },
  },
})
@Controller('cm-assessment-question')
export class CMAssessmentQuestionController implements CrudController<CMAssessmentQuestion>
{
  constructor(public service: CMAssessmentQuestionService,
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
    return await this.service.saveResult(req.result, req.assessment)
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

  @UseGuards(JwtAuthGuard)
  @Post('saveTcValue')
  async saveTcValue(@Query('assessmentId') assessmentId: number){
    return await this.service.saveTcValue(assessmentId)
  }

  @Post('upload-file')
  @UseInterceptors( FilesInterceptor('files',20, { storage: diskStorage({destination: '/home/ubuntu/code/Main/main/public/uploads',filename: editFileName})}),)
  async uploadJustification(@UploadedFiles() files: Array<Express.Multer.File>
  ) {
    return {fileName: files[0].filename}
    // let savedFiles = await Promise.all(files.map(file => this.saveFile(file)));
    // return savedFiles;
  }

 

}
