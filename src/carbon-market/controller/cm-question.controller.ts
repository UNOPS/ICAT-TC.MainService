import { Crud, CrudController } from "@nestjsx/crud";
import { AssessmentCMDetail } from "../entity/assessment-cm-detail.entity";
import { Controller, Get, Query } from "@nestjs/common";
import { AssessmentCMDetailService } from "../service/assessment-cm-detail.service";
import { CMQuestion } from "../entity/cm-question.entity";
import { CMQuestionService } from "../service/cm-question.service";


@Crud({
  model: {
    type: CMQuestion,
  },
  query: {
    join: {
      pre_question: {
        eager: true,
      },
      prev_answer_to_generate: {
        eager: true
      },
      criteria: {
        eager: true
      }
    },
  },
})
@Controller('cm-question')
export class CMQuestionController implements CrudController<CMQuestion>
{
  constructor(public service: CMQuestionService,
  ) { }

  get base(): CrudController<CMQuestion> {
    return this;
  }

  @Get('get-all-section')
  async getAllSection(){
    return await this.service.getAllSection()
  }

  @Get('get-criteria-by-section')
  async getCriteriaBySectionId(@Query('sectionId') sectionId: number){
    return await this.service.getCriteriaBySectionId(sectionId)
  }


}
