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
import { CMAssessmentQuestionController } from "./controller/cm-assessment-question.controller";
import { CMAssessmentQuestionService } from "./service/cm-assessment-question.service";
import { CMAssessmentAnswerController } from "./controller/cm-assessment-answer.controller";
import { CMAssessmentAnswerService } from "./service/cm-assessment-answer.service";
import { CMSeedController } from "./controller/cm-seed.controller";
import { CMSeedService } from "./service/cm-seed.service";


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
    CMQuestionController,
    CMAssessmentQuestionController,
    CMAssessmentAnswerController,
    CMSeedController
  ],
  providers: [
    AssessmentCMDetailService,
    CMQuestionService,
    CMAssessmentQuestionService,
    CMAssessmentAnswerService,
    CMSeedService
  ],
  exports: [],
})
export class CarbonMarketModule {}
