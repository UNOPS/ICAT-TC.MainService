import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { AssessmentCMDetail } from "../entity/assessment-cm-detail.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CMQuestion } from "../entity/cm-question.entity";


@Injectable()
export class CMQuestionService extends TypeOrmCrudService<CMQuestion> {
  constructor(
    @InjectRepository(CMQuestion) repo
  ) {
    super(repo);
  }
}


