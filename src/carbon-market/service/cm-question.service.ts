import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CMQuestion } from "../entity/cm-question.entity";
import { Criteria } from "../entity/criteria.entity";
import { Repository } from "typeorm-next";
import { Section } from "../entity/section.entity";

@Injectable()
export class CMQuestionService extends TypeOrmCrudService<CMQuestion> {
  constructor(
    @InjectRepository(CMQuestion) repo,
    @InjectRepository(Criteria)
    private criteriaRepo: Repository<Criteria>,
    @InjectRepository(Section)
    private sectionRepo: Repository<Section>
  ) {
    super(repo);
  }

  async getAllSection():Promise<Section[]>{
    return await this.sectionRepo.find()
  }

  async getCriteriaBySectionId(sectionId: number):Promise<Criteria[]>{
    return await this.criteriaRepo.find({section: {id: sectionId}})
  }
}


