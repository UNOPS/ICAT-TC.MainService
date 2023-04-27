import { Crud, CrudController } from "@nestjsx/crud";
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CMAssessmentQuestion } from "../entity/cm-assessment-question.entity";
import { CMAssessmentQuestionService } from "../service/cm-assessment-question.service";
import { CMResultDto, SaveCMResultDto } from "../dto/cm-result.dto";
import { Assessment } from "src/assessment/entities/assessment.entity";


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

  @Post()
  async save(@Body() assessmentQuestion: CMAssessmentQuestion){
    return await this.service.create(assessmentQuestion)
  }

  @Post('save-result')
  async saveResult(@Body() req: SaveCMResultDto){
    return await this.service.saveResult(req.result, req.assessment)
  }



}
