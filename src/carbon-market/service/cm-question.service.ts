import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CMQuestion } from "../entity/cm-question.entity";
import { Criteria } from "../entity/criteria.entity";
import { Section } from "../entity/section.entity";
import { CMAnswer } from "../entity/cm-answer.entity";
import { Repository } from "typeorm";
import { categories, characteristic, questions } from "../dto/seed-data";

@Injectable()
export class CMQuestionService extends TypeOrmCrudService<CMQuestion> {
  constructor(
    @InjectRepository(CMQuestion) repo,
    @InjectRepository(Criteria)
    private criteriaRepo: Repository<Criteria>,
    @InjectRepository(Section)
    private sectionRepo: Repository<Section>,
    @InjectRepository(CMAnswer)
    private answerRepo: Repository<CMAnswer>
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
    .innerJoinAndMapOne(
      'criteria.section',
      Section,
      'section',
      'section.id = criteria.sectionId'
    )
    .where('criteria.id = :criteriaId', {criteriaId: criteriaId})

    return data.getMany()
  }

  async getAnswersByQuestion(questionId: number){
    // return await this.answerRepo.find({question: {id: questionId}})
    let data = this.answerRepo.createQueryBuilder('answer')
    .leftJoinAndSelect(
      'answer.question',
      'question',
      'question.id = answer.questionId'
    )
    .where('question.id = :questionId', {questionId: questionId})

    return await data.getMany()
  }

  async getUniqueCharacterisctics() {
    let data = this.repo.createQueryBuilder('question')
      // .distinct(true)
      .innerJoinAndSelect(
        'question.characteristic',
        'characteristic',
        'characteristic.id = question.characteristicId'
      )
      .innerJoinAndSelect(
        'characteristic.category',
        'category',
        'category.id = characteristic.category_id'
      )
      .where('characteristic.id is not null')
      .groupBy('characteristic.code')

    let characteristics = await data.getMany()
    let res = { process: { categories: [], characteristic: {} }, outcome: { categories: [], characteristic: {} } }
    res.process.categories = []
    res.outcome.categories = []

    characteristics.map(char => {
      if (char.characteristic.category.type === 'process') {
        if (res.process.characteristic[char.characteristic.category.code]) {
          res.process.characteristic[char.characteristic.category.code].push({ name: char.characteristic.name, code: char.characteristic.code, id: char.characteristic.id })
        } else {
          res.process.categories.push({ name: char.characteristic.category.name, code: char.characteristic.category.code })
          res.process.characteristic[char.characteristic.category.code] = [{ name: char.characteristic.name, code: char.characteristic.code, id: char.characteristic.id }]
        }
      } else if (char.characteristic.category.type === 'outcome') {
        if (res.outcome.characteristic[char.characteristic.category.code]) {
          res.outcome.characteristic[char.characteristic.category.code].push({ name: char.characteristic.name, code: char.characteristic.code, id: char.characteristic.id })
        } else {
          res.outcome.categories.push({ name: char.characteristic.category.name, code: char.characteristic.category.code })
          res.outcome.characteristic[char.characteristic.category.code] = [{ name: char.characteristic.name, code: char.characteristic.code, id: char.characteristic.id }]
        }
      }
    })

    return res
  }

  async getQuestionsByCharacteristicId(ids: number[]) {
    let data = this.repo.createQueryBuilder('question')
      .leftJoinAndSelect(
        'question.characteristic',
        'characteristic',
        'characteristic.id = question.characteristicId'
      ).innerJoinAndMapOne(
        'question.criteria',
        Criteria,
        'criteria',
        'criteria.id = question.criteriaId'
      )
      .innerJoinAndMapOne(
        'criteria.section',
        Section,
        'section',
        'section.id = criteria.sectionId'
      ).where('characteristic.id In (:id)', {id: ids})

      let questions = await data.getMany()
      let res = {}
      questions.forEach(question => {
        if (res[question.characteristic.code]){
          res[question.characteristic.code].push(question)
        } else {
          res[question.characteristic.code] = [question]
        }
      })

      return res
  }

}


