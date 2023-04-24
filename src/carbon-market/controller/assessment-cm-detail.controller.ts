import { Crud, CrudController } from "@nestjsx/crud";
import { AssessmentCMDetail } from "../entity/assessment-cm-detail.entity";
import { Controller } from "@nestjs/common";
import { AssessmentCMDetailService } from "../service/assessment-cm-detail.service";


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
export class AssessmentCMDetailController
  implements CrudController<AssessmentCMDetail>
{
  constructor(public service: AssessmentCMDetailService,
  ) { }

  get base(): CrudController<AssessmentCMDetail> {
    return this;
}

}
