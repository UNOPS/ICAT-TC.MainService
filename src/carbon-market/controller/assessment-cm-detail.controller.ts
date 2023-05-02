import { Crud, CrudController } from "@nestjsx/crud";
import { AssessmentCMDetail } from "../entity/assessment-cm-detail.entity";
import { Controller, Get, Query } from "@nestjs/common";
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
    exclude: ['id']
  },
})
@Controller('assessment-cm-detail')
export class AssessmentCMDetailController
  implements CrudController<AssessmentCMDetail>
{
  constructor(public service: AssessmentCMDetailService,
  ) { }

  get base(): CrudController<AssessmentCMDetail> {
    return this;
  }


  @Get('get-by-assessment-id')
  async getAssessmentCMDetailByAssessmentId(@Query('assessmentId') assessmnetId: number){
    return await this.service.getAssessmentCMDetailByAssessmentId(assessmnetId)
  }

}
