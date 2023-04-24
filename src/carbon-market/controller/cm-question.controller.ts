import { Crud, CrudController } from "@nestjsx/crud";
import { AssessmentCMDetail } from "../entity/assessment-cm-detail.entity";
import { Controller } from "@nestjs/common";
import { AssessmentCMDetailService } from "../service/assessment-cm-detail.service";
import { CMQuestion } from "../entity/cm-question.entity";
import { CMQuestionService } from "../service/cm-question.service";


@Crud({
  model: {
    type: AssessmentCMDetail,
  },
  query: {
    join: {
      assessment: {
        eager: true,
      }
    },
  },
})
@Controller()
export class CMQuestionController implements CrudController<CMQuestion>
{
  constructor(public service: CMQuestionService,
  ) { }

  get base(): CrudController<CMQuestion> {
    return this;
}

}
