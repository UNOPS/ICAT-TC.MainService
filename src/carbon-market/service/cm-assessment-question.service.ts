import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CMAssessmentQuestion } from "../entity/cm-assessment-question.entity";
import { CMResultDto } from "../dto/cm-result.dto";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { CMAssessmentAnswer } from "../entity/cm-assessment-answer.entity";
import { Repository } from "typeorm";
import { Results } from "src/methodology-assessment/entities/results.entity";
import { Approach } from "../enum/answer-type.enum";
import { ParameterRequest } from "src/data-request/entity/data-request.entity";
import { request } from "http";
import { Tool } from "src/data-request/enum/tool.enum";

@Injectable()
export class CMAssessmentQuestionService extends TypeOrmCrudService<CMAssessmentQuestion> {
 
  constructor(
    @InjectRepository(CMAssessmentQuestion) repo,
    @InjectRepository(CMAssessmentAnswer) 
    private assessmentAnswerRepo: Repository<CMAssessmentAnswer>,
    @InjectRepository(CMAssessmentQuestion)
    private assessmentQuestionRepo: Repository<CMAssessmentQuestion>,
    @InjectRepository(Results)
    private resultsRepo: Repository<Results>,
    @InjectRepository(Assessment)
    private assessmentRepo: Repository<Assessment>,
    @InjectRepository(ParameterRequest)
    private parameterRequestRepo: Repository<ParameterRequest>
  ) {
    super(repo);
  }

  async create(question:CMAssessmentQuestion){
    return await this.repo.save(question)
  }

  /**
   * 
   * @param result 
   * @param assessment 
   * For passing answers and answers with 0 score set weight in answer table as 0.
   */
  
  async saveResult(result: CMResultDto[], assessment: Assessment, score = 1) {
    let a_ans: any[]
    for await (let res of result) {
      let ass_question = new CMAssessmentQuestion()
      ass_question.assessment = assessment;
      ass_question.comment = res.comment;
      ass_question.question = res.question;
      if (res.question?.id === undefined) ass_question.question = undefined
      ass_question.characteristic = res.characteristic;
      if (res.characteristic?.id === undefined) ass_question.characteristic = undefined
      ass_question.sdgIndicator = res.sdgIndicator;
      ass_question.startingSituation = res.startingSituation;
      ass_question.expectedImpact = res.expectedImpact;
      ass_question.selectedSdg = res.selectedSdg;
      let q_res
      try{
        q_res = await this.repo.save(ass_question)
      }catch(err){
        console.log(err)
        return new InternalServerErrorException()
      }
      let _answers = []

      // if (res.answer || res.institution){
      if (res.type === 'INDIRECT') {
        let ass_answer = new CMAssessmentAnswer()
        ass_answer.institution = res.institution
        ass_answer.institution = undefined
        ass_answer.assessment_question = q_res
        ass_answer.approach = Approach.INDIRECT
        _answers.push(ass_answer)
      } else {
        let ass_answer = new CMAssessmentAnswer()
        if (res.answer) {
          ass_answer.answer = res.answer
          ass_answer.score = score * res.answer.score_portion / 100 * res.answer.weight / 100
        }
        ass_answer.assessment_question = q_res
        ass_answer.selectedScore = res.selectedScore
        ass_answer.approach = Approach.DIRECT

        _answers.push(ass_answer)
      }
      console.log(_answers)
      try{
        a_ans = await this.assessmentAnswerRepo.save(_answers)
      }catch(err){
        console.log(err)
        return new InternalServerErrorException()
      }
      /*   let result = new Results()
        result.assessment = assessment;
        await this.resultsRepo.save(result)  */
      // await this.saveDataRequests(_answers)
      // }

    }

    if(assessment.assessment_approach=== 'DIRECT'){
      let resultObj = new Results()
      resultObj.assessment = assessment;
      await this.resultsRepo.save(resultObj) 
      
    }
    this.saveTcValue(assessment.id)


    
    return a_ans
  }

  async calculateResult(assessmentId: number) {
    let tc_score = 0
    let questions = await this.assessmentQuestionRepo
      .createQueryBuilder('aq')
      .innerJoin(
        'aq.assessment',
        'assessment',
        'assessment.id = aq.assessmentId'
      )
      .where('assessment.id = :id', { id: assessmentId })
      .getMany()
    if (questions.length > 0) {
      let qIds: number[] = questions.map((q) => q.id)
      console.log(qIds)
      let answers = await this.assessmentAnswerRepo
        .createQueryBuilder('ans')
        .innerJoin(
          'ans.assessment_question',
          'question',
          'question.id = ans.assessmentQuestionId'
        )
        .where('question.id In (:id)', { id: qIds })
        .getMany()
      answers.forEach(ans => {
        tc_score += ans.score
      })
      let score = tc_score * 100
      let res
      if (score > 70 || score === 70){
        res =  score.toFixed(3) + '% - Highly transformational activity'
      } else if (score > 30 || score === 30 || score < 69 || score === 69){
        res =  score.toFixed(3) + '% - Mild/medium transformation potential'
      } else {
        res =  score.toFixed(3) + '% - Low transformation potential'
      }
      return {score: res}
    } else {
      return 'No questions found for this assessment'
    }
  }

  async getResults(assessmentId: number){
    let result = []
    let questions = await this.assessmentQuestionRepo
      .createQueryBuilder('aq')
      .innerJoin(
        'aq.assessment',
        'assessment',
        'assessment.id = aq.assessmentId'
      )
      .where('assessment.id = :id', { id: assessmentId })
      .getMany()

      if (questions.length > 0) {
        let qIds: number[] = questions.map((q) => q.id)
        console.log(qIds)
        let answers = await this.assessmentAnswerRepo
          .createQueryBuilder('ans')
          .innerJoinAndSelect(
            'ans.assessment_question',
            'question',
            'question.id = ans.assessmentQuestionId'
          )
          .innerJoinAndSelect(
            'ans.answer',
            'answer',
            'answer.id = ans.answerId'
          )
          .innerJoinAndSelect(
            'question.question',
            'cmquestion',
            'cmquestion.id = question.questionId'
          )
          .innerJoinAndSelect(
            'cmquestion.criteria',
            'criteria',
            'criteria.id = cmquestion.criteriaId'
          )
          .innerJoinAndSelect(
            'criteria.section',
            'section',
            'section.id = criteria.sectionId'
          )
          .where('question.id In (:id)', { id: qIds })
          .getMany()

          let criteria = []

          answers.forEach(ans => {
            let obj = {
              section: ans.assessment_question.question.criteria.section.name,
              criteria: ans.assessment_question.question.criteria.name,
              question: ans.assessment_question.question.label,
              answer: ans.answer.label,
              comment: ans.assessment_question.comment
            }
            criteria.push(ans.assessment_question.question.criteria.name)
            result.push(obj)
          })


          result = this.group(result, 'section')

          return {
            result: result,
            criteria: criteria
          }
      } 
  }

  group(list: any[], prop: string | number){
    return list.reduce((groups, item) => ({
      ...groups,
      [item[prop]]: [...(groups[item[prop]] || []), item]
    }), {});
  }


  async saveTcValue(assessmentId: number) {
    console.log("called saveTcValue",assessmentId)
    let tc_score = 0
    let questions = await this.assessmentQuestionRepo
      .createQueryBuilder('aq')
      .innerJoin(
        'aq.assessment',
        'assessment',
        'assessment.id = aq.assessmentId'
      )
      .where('assessment.id = :id', { id: assessmentId })
      .getMany()
    if (questions.length > 0) {
      
      let qIds: number[] = questions.map((q) => q.id)
      console.log(qIds)
      let answers = await this.assessmentAnswerRepo
        .createQueryBuilder('ans')
        .innerJoin(
          'ans.assessment_question',
          'question',
          'question.id = ans.assessmentQuestionId'
        )
        .where('question.id In (:id)', { id: qIds })
        .getMany()
      answers.forEach(ans => {
        tc_score += ans.score
      })
      let score = tc_score * 100
      
      await this.assessmentRepo
        .createQueryBuilder()
        .update(Assessment)
        .set({ tc_value: score})
        .where("id = :id", { id: assessmentId })
        .execute()

        console.log("updated tc value ",score, "for id",assessmentId)
      
    }

  }

  async saveDataRequests(answers: CMAssessmentAnswer[]){
    let requests = []
    answers.forEach(ans => {
      if (ans.institution !== undefined){
        let request = new ParameterRequest()
        request.tool = Tool.CM_tool
        request.cmAssessmentAnswer = ans
  
        requests.push(request)
      }
    })

    await this.parameterRequestRepo.save(requests)
  }


}


