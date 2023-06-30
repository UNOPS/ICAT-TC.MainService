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
import { Characteristics } from "src/methodology-assessment/entities/characteristics.entity";
import { Category } from "src/methodology-assessment/entities/category.entity";
import { CMQuestion } from "../entity/cm-question.entity";
import { CMAnswer } from "../entity/cm-answer.entity";
import { Criteria } from "../entity/criteria.entity";
import { Section } from "../entity/section.entity";

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
      ass_question.uploadedDocumentPath = res.filePath
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
        if (res.answer && res.answer.id !== undefined) {
          ass_answer.answer = res.answer
          ass_answer.score = (score * res.answer.score_portion * res.answer.weight / 100 ) / 4
        }
        if (res.isGHG){
          ass_answer.score = (res.selectedScore.value / 6) * (10 / 100) 
        }
        if (res.isSDG){
          ass_answer.score = (res.selectedScore.value / 6) * (2.5 / 100) * (10 / 100) 
        }
        ass_answer.assessment_question = q_res
        ass_answer.selectedScore = res.selectedScore.code
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
    let processData:{technology:any[],incentives:any[], norms:any[],}={ technology: [], incentives: [], norms: [] };
    let outcomeData:{scale_GHGs:any[],sustained_GHGs:any[], scale_SDs:any[],sustained_SDs:any[]}={ scale_GHGs: [], sustained_GHGs: [], scale_SDs: [], sustained_SDs: [] };

     
     
   
      
      
     
    
    
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
          .leftJoinAndMapOne(
            'ans.answer',
            CMAnswer,
            'answer',
            'answer.id = ans.answerId'
          )
          .leftJoinAndMapOne(
            'question.question',
            CMQuestion,
            'cmquestion',
            'cmquestion.id = question.questionId'
          )
          .leftJoinAndMapOne(
            'question.characteristic',
            Characteristics,
            'characteristic',
            'characteristic.id = question.characteristicId'
          )
          .leftJoinAndMapOne(
            'characteristic.category',
            Category,
            'category',
            'category.id = characteristic.category_id'
          )
          .leftJoinAndMapOne(
            'cmquestion.criteria',
            Criteria,
            'criteria',
            'criteria.id = cmquestion.criteriaId'
          )
          .leftJoinAndMapOne(
            'criteria.section',
            Section,
            'section',
            'section.id = criteria.sectionId'
          )
          .where('question.id In (:id)', { id: qIds })
          .getMany()
          // answers.forEach(ans=>{console.log("3333",ans.assessment_question.id)})
          let criteria = []
          answers.forEach(ans => {
            let obj = {
              // data:ans,
              characteristic:ans.assessment_question?.characteristic?.name,
              question: ans?.assessment_question?.question?.label,
              score: ans?.answer?.score_portion,
              justification: ans?.assessment_question?.comment,
              document: ans?.assessment_question?.uploadedDocumentPath,
              category:ans?.assessment_question?.characteristic?.category,
              starting_situation:ans?.assessment_question?.startingSituation,
              expected_impacts:ans?.assessment_question?.expectedImpact,
              SDG:ans?.assessment_question?.selectedSdg,
              outcome_score:ans?.selectedScore
              
            }
            if(obj?.category?.code=='TECHNOLOGY'){
              processData.technology.push(obj)
            }
            else if(obj?.category?.code=='INCENTIVES'){
              processData.incentives.push(obj)
            }
            else if(obj?.category?.code=='NORMS'){
              processData.norms.push(obj)
            }

           if(obj?.category?.code=='SCALE_GHG'){
              outcomeData.scale_GHGs.push(obj)
            }
            else if(obj?.category?.code=='SUSTAINED_GHG'){
              outcomeData.sustained_GHGs.push(obj)
            }
            else if(obj?.category?.code=='SCALE_SD'){
              outcomeData.scale_SDs.push(obj)
            }
            else if(obj?.category?.code=='SUSTAINED_SD'){
              outcomeData.sustained_SDs.push(obj)
            }
           
            
            
          })

          answers.forEach(ans => {
            let obj = {
              section: ans?.assessment_question?.question?.criteria?.section?.name,
              criteria: ans?.assessment_question?.question?.criteria?.name,
              question: ans.assessment_question?.question?.label,
              answer: ans?.answer?.label,
              comment: ans.assessment_question.comment,
              document: ans?.assessment_question?.uploadedDocumentPath,
              
            }
            criteria.push(ans?.assessment_question?.question?.criteria?.name)
            result.push(obj)
          })


          result = this.group(result, 'section')

          return {
            result: result,
            criteria: criteria,
            processData:processData,
            outComeData:outcomeData,
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


