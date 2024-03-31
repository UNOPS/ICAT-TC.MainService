import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CMAssessmentAnswer } from "../entity/cm-assessment-answer.entity";
import { ParameterRequest } from "src/data-request/entity/data-request.entity";
import { Repository } from "typeorm-next";
import { CMQuestionService } from "./cm-question.service";

const schema = {
  'id': {
    prop: 'id',
    type: Number
  },
  'questionId': {
    prop: 'questionId',
    type: Number
  },
  'answer': {
    prop: 'answer',
    type: String
  }
}
@Injectable()
export class CMAssessmentAnswerService extends TypeOrmCrudService<CMAssessmentAnswer> {
 
  constructor(
    @InjectRepository(CMAssessmentAnswer) repo,
    @InjectRepository(ParameterRequest) private parameterRequestRepository: Repository<ParameterRequest>,
    private cMQuestionService: CMQuestionService
  ) {
    super(repo);
  }

  readXlsxFile = require('read-excel-file/node');

  async create(question:CMAssessmentAnswer){
    return await this.repo.save(question)
  }

  async uplaodFileUpload(fileName: string) {
    this.readXlsxFile('./uploads/' + fileName, { schema }).then(({ rows, errors }) => {
      rows.forEach(async (key) => {
        let dataEnterItem = await this.repo.findOne({
          where: { id: key.id }
        })

        let dataStatusItem = await this.parameterRequestRepository.find({
          where: { parameter: key.id }
        })

        dataStatusItem.forEach(async (e) => {
          if (e.dataRequestStatus === 4 || e.dataRequestStatus === 5 || e.dataRequestStatus === -8) {
            if (key.questionId){
              let answers = await this.cMQuestionService.getAnswersByQuestion(key.questionId)
              let answer = answers.find(o => o.label === key.answer)
              dataEnterItem.answer = answer;
              dataEnterItem.score = (answer.score_portion * answer.weight / 100 ) / 4
            } else {
              dataEnterItem.selectedScore = key.answer
              if (['SUSTAINED_GHG', 'SCALE_GHG'].includes(key.category_code)){
                dataEnterItem.score = (parseInt(key.answer) / 6) * (10 / 100) 
              } else {
                dataEnterItem.score = (parseInt(key.answer) / 6) * (2.5 / 100) * (10 / 100) 
              }
            }


            let res = await this.repo.save(dataEnterItem);
            if (res) {
              e.dataRequestStatus = 5
              await this.parameterRequestRepository.save(e)
            }
          }
        })
      });
    });
  }

  async deleteAssessmentAnswers(cmAssessmentQuestionIds: number[]) {
    try {
      for await (let id of cmAssessmentQuestionIds) {
        await this.repo.delete({assessment_question: {id: id}});
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }


}


