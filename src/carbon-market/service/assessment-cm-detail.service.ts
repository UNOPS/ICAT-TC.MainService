import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { AssessmentCMDetail } from "../entity/assessment-cm-detail.entity";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class AssessmentCMDetailService extends TypeOrmCrudService<AssessmentCMDetail> {
  constructor(
    @InjectRepository(AssessmentCMDetail) repo
  ) {
    super(repo);
  }

  getAssessmentCMDetailByAssessmentId(assessmentId: number){
    let data = this.repo.createQueryBuilder('detail')
    .innerJoin(
      'detail.cmassessment',
      'assessment',
      'assessment.id = detail.cmassessmentId'
    )
    .where('assessment.id = :id', {id: assessmentId})

    return data.getOne()
  }
}


