import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CMAssessmentQuestion } from "../entity/cm-assessment-question.entity";
import { CMResultDto } from "../dto/cm-result.dto";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { CMAssessmentAnswer } from "../entity/cm-assessment-answer.entity";
import { Repository } from "typeorm";
import { Results } from "src/methodology-assessment/entities/results.entity";
import { Approach } from "../enum/answer-type.enum";

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
    private assessmentRepo: Repository<Assessment>
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
    console.log("hittt")
    for await (let res of result) {
      let ass_question = new CMAssessmentQuestion()
      ass_question.assessment = assessment;
      ass_question.comment = res.comment;
      ass_question.question = res.question;

      let q_res = await this.repo.save(ass_question)
      let answers = []

      console.log("typeeee", res.type)
      if (res.answer || res.institution){
        if (res.type === 'INDIRECT'){
          console.log("ooooppp")
          let ass_answer = new CMAssessmentAnswer()
          ass_answer.institution = res.institution
          ass_answer.assessment_question = q_res
          ass_answer.approach = Approach.INDIRECT
          answers.push(ass_answer)
          console.log("anss", ass_answer)
        } else {
          if (Array.isArray(res.answer)) {
            res.answer.forEach(async ans => {
              let ass_answer = new CMAssessmentAnswer()
              ass_answer.answer = ans
              ass_answer.assessment_question = q_res
              ass_answer.score = score * ans.score_portion/100 * ans.weight/100
              ass_answer.approach = Approach.DIRECT
    
              answers.push(ass_answer)
            })
          } else {
            let ass_answer = new CMAssessmentAnswer()
            ass_answer.answer = res.answer
            ass_answer.assessment_question = q_res
            ass_answer.score = score * res.answer.score_portion/100 * res.answer.weight/100
            ass_answer.approach = Approach.DIRECT
  
            console.log("ans: ",ass_answer.score)
    
            answers.push(ass_answer)
          }
        }
        console.log("answerrppp: ",answers)
        a_ans = await this.assessmentAnswerRepo.save(answers)
      /*   let result = new Results()
        result.assessment = assessment;
        await this.resultsRepo.save(result)  */

        
      }

    }

    if(assessment.assessment_approach=== 'DIRECT'){
      let resultObj = new Results()
      resultObj.assessment = assessment;
      await this.resultsRepo.save(resultObj) 
      
    }
    
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


}


