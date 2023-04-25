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
    let data = this.criteriaRepo.createQueryBuilder('criteria')
    .innerJoinAndMapOne(
      'criteria.section',
      Section,
      'section',
      'criteria.sectionId = section.id'
    )
    .where ('section.id = :sectionId', {sectionId: sectionId})

    return await data.getMany()
  }

  async getQuestionsByCriteria(criteriaId: number){
    let data = this.repo.createQueryBuilder('question')
    .innerJoinAndMapOne(
      'question.criteria',
      Criteria,
      'criteria',
      'criteria.id = question.criteriaId'
    )
    .where('criteria.id = :criteriaId', {criteriaId: criteriaId})

    return data.getMany()
  }
}


