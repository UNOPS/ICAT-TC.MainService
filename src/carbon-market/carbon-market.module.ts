import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssessmentCMDetail } from "./entity/assessment-cm-detail.entity";
import { AssessmentCMDetailService } from "./service/assessment-cm-detail.service";
import { CMQuestion } from "./entity/cm-question.entity";
import { CMAnswer } from "./entity/cm-answer.entity";
import { Section } from "./entity/section.entity";
import { Criteria } from "./entity/criteria.entity";
import { CMAssessmentQuestion } from "./entity/cm-assessment-question.entity";
import { CMAssessmentAnswer } from "./entity/cm-assessment-answer.entity";
import { AssessmentCMDetailController } from "./controller/assessment-cm-detail.controller";
import { CMQuestionService } from "./service/cm-question.service";
import { CMQuestionController } from "./controller/cm-question.controller";


@Module({
  imports: [
    TypeOrmModule.forFeature([
      AssessmentCMDetail,
      CMQuestion,
      CMAnswer,
      Section,
      Criteria,
      CMAssessmentQuestion,
      CMAssessmentAnswer
    ]),
  ],
  controllers: [
    AssessmentCMDetailController,
    CMQuestionController
  ],
  providers: [
    AssessmentCMDetailService,
    CMQuestionService
  ],
  exports: [],
})
export class CarbonMarketModule {}
