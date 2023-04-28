import { Crud, CrudController } from "@nestjsx/crud";
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CMAssessmentQuestion } from "../entity/cm-assessment-question.entity";
import { CMAssessmentQuestionService } from "../service/cm-assessment-question.service";
import { CMAssessmentAnswer } from "../entity/cm-assessment-answer.entity";
import { CMAssessmentAnswerService } from "../service/cm-assessment-answer.service";


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
@Controller('cm-assessment-answer')
export class CMAssessmentAnswerController implements CrudController<CMAssessmentAnswer>
{
  constructor(public service: CMAssessmentAnswerService,
  ) { }

  get base(): CrudController<CMAssessmentAnswer> {
    return this;
  }

  @Post()
  async save(@Body() assessmentQuestion: CMAssessmentAnswer){
    return await this.service.create(assessmentQuestion)
  }



}
