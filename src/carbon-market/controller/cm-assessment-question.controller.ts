import { Crud, CrudController } from "@nestjsx/crud";
import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { CMAssessmentQuestion } from "../entity/cm-assessment-question.entity";
import { CMAssessmentQuestionService } from "../service/cm-assessment-question.service";
import { CMResultDto, CalculateDto, SaveCMResultDto } from "../dto/cm-result.dto";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { LocalAuthGuard } from "src/auth/guards/local-auth.guard";


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
  async calculateResult(@Body() req: CalculateDto){
    return await this.service.calculateResult(req.assessmentId)
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-result')
  async getResults(@Query('assessmentId') assessmentId: number): Promise<any>{
    return await this.service.getResults(assessmentId)
  }



}
