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
}


