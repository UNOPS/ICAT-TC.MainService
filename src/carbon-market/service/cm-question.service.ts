import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CMQuestion } from "../entity/cm-question.entity";
import { Criteria } from "../entity/criteria.entity";
import { Section } from "../entity/section.entity";
import { CMAnswer } from "../entity/cm-answer.entity";
import { Repository } from "typeorm";
import { categories, characteristic, questions } from "../dto/seed-data";
import { CMResultDto, UniqueCategories, UniqueCategory, UniqueCharacteristic } from "../dto/cm-result.dto";

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

  async getUniqueCharacterisctics(): Promise<UniqueCategories> {
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
      // .groupBy('characteristic.code')

    let questions = await data.getMany()

    let categories = new UniqueCategories()
    categories.process = []
    categories.outcome = []

    questions.map(ch => {
      ch['result'] = new CMResultDto()
      ch['result'].characteristic = ch.characteristic

      if (ch.characteristic.category.type === 'process') {
        let cat = categories.process?.find(o => o.code === ch.characteristic.category.code)
        if (cat){
          let char = cat.characteristics.find(o => o.code === ch.characteristic.code)
          if (char === undefined){
            char = new UniqueCharacteristic()
            char.name = ch.characteristic.name
            char.code = ch.characteristic.code
            char.description = ch.characteristic.description
            char.main_question = ch.characteristic.main_question
            char.id = ch.characteristic.id
            char.questions.push(ch)
            cat.characteristics.push(char)
          } else {
            char.questions.push(ch)
          }
        } else {
          let _char = new UniqueCharacteristic()
          _char.name = ch.characteristic.name
          _char.code = ch.characteristic.code
          _char.description = ch.characteristic.description
          _char.main_question = ch.characteristic.main_question
          _char.id = ch.characteristic.id
          _char.questions.push(ch)
          cat = new UniqueCategory()
          cat.name = ch.characteristic.category.name
          cat.code = ch.characteristic.category.code
          cat.description = ch.characteristic.category.description
          cat.characteristics = [_char]
          categories.process.push(cat)
        }
      } else if (ch.characteristic.category.type === 'outcome') {
        let cat = categories.outcome.find(o => o.code === ch.characteristic.category.code)
        if (cat){
          let char = cat.characteristics.find(o => o.code === ch.characteristic.code)
          if (char === undefined){
            char = new UniqueCharacteristic()
            char.name = ch.characteristic.name
            char.code = ch.characteristic.code
            char.id = ch.characteristic.id
            cat.characteristics.push(char)
          }
        } else {
          let _char = new UniqueCharacteristic()
          _char.name = ch.characteristic.name
          _char.code = ch.characteristic.code
          _char.id = ch.characteristic.id
          cat = new UniqueCategory()
          cat.name = ch.characteristic.category.name
          cat.code = ch.characteristic.category.code
          cat.characteristics = [_char]
          categories.outcome.push(cat)
        }
      }
    })

    return categories
  }

  async getQuestionsByCharacteristicId(ids: number[]) {
    let data = this.repo.createQueryBuilder('question')
      .leftJoinAndSelect(
        'question.characteristic',
        'characteristic',
        'characteristic.id = question.characteristicId'
      )
      // .innerJoinAndMapOne(
      //   'question.criteria',
      //   Criteria,
      //   'criteria',
      //   'criteria.id = question.criteriaId'
      // )
      // .innerJoinAndMapOne(
      //   'criteria.section',
      //   Section,
      //   'section',
      //   'section.id = criteria.sectionId'
      // )
      .where('characteristic.id In (:id)', {id: ids})

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


