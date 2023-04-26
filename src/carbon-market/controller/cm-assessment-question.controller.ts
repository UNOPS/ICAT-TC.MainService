import { Crud, CrudController } from "@nestjsx/crud";
import { Controller, Get, Query } from "@nestjs/common";
import { CMAssessmentQuestion } from "../entity/cm-assessment-question.entity";
import { CMAssessmentQuestionService } from "../service/cm-assessment-question.service";


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



}
