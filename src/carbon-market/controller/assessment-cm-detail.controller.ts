import { Crud, CrudController } from "@nestjsx/crud";
import { AssessmentCMDetail } from "../entity/assessment-cm-detail.entity";
import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AssessmentCMDetailService } from "../service/assessment-cm-detail.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { LocalAuthGuard } from "src/auth/guards/local-auth.guard";


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

  @UseGuards(JwtAuthGuard)
  @Get('get-by-assessment-id')
  async getAssessmentCMDetailByAssessmentId(@Query('assessmentId') assessmnetId: number){
    return await this.service.getAssessmentCMDetailByAssessmentId(assessmnetId)
  }

  @UseGuards(JwtAuthGuard)
  @Get('getPrerequisite')
  async getPrerequisite(): Promise<any>{
    return await this.service.getPrerequisite()
  }

  // @UseGuards(JwtAuthGuard)
  @Get('getSectorCount')
  async getSectorCount(): Promise<any>{
    return await this.service.getSectorCount()
  }






}
