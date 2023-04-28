import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CMAssessmentQuestion } from "../entity/cm-assessment-question.entity";
import { CMAssessmentAnswer } from "../entity/cm-assessment-answer.entity";

@Injectable()
export class CMAssessmentAnswerService extends TypeOrmCrudService<CMAssessmentAnswer> {
  constructor(
    @InjectRepository(CMAssessmentAnswer) repo,
  ) {
    super(repo);
  }

  async create(question:CMAssessmentAnswer){
    return await this.repo.save(question)
  }


}


