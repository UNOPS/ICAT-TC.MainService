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
    private parameterRequestRepo: Repository<ParameterRequest>,
    @InjectRepository(Characteristics)
    private characteristicRepo: Repository<Characteristics>
  ) {
    super(repo);
  }

  async create(question: CMAssessmentQuestion) {
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
    let _answers = []
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
      ass_question.uploadedDocumentPath = res.filePath;
      ass_question.relevance = res.relevance;
      ass_question.adaptationCoBenifit = res.adaptationCoBenifit;
      let q_res
      try {
        q_res = await this.repo.save(ass_question)
      } catch (err) {
        console.log(err)
        return new InternalServerErrorException()
      }

      if (res.type === 'INDIRECT') {
        let ass_answer = new CMAssessmentAnswer()
        ass_answer.institution = res.institution
        ass_answer.assessment_question = q_res
        ass_answer.approach = Approach.INDIRECT
        _answers.push(ass_answer)
      } else {
        let ass_answer = new CMAssessmentAnswer()
        ass_answer.institution = undefined
        if (res.answer && res.answer.id !== undefined) {
          ass_answer.answer = res.answer
          // ass_answer.score = (score * res.answer.score_portion * res.answer.weight / 100 ) / 4 //previous calculation
          ass_answer.score = res.answer.score_portion * res.answer.weight / 100
        }
        if (res.selectedScore && res.selectedScore.value) {
          if (res.isGHG || res.isAdaptation) {
            // ass_answer.score = (res.selectedScore.value / 6) * (10 / 100) //previous calculation
            ass_answer.score = (res.selectedScore.value / 6)
          }
          if (res.isSDG) {
            // ass_answer.score = (res.selectedScore.value / 6) * (2.5 / 100) * (10 / 100)  //previous calculation
            ass_answer.score = (res.selectedScore.value / 12)
          }
        }
        ass_answer.assessment_question = q_res
        ass_answer.selectedScore = res.selectedScore?.code
        ass_answer.approach = Approach.DIRECT

        _answers.push(ass_answer)
      }
    }
    try {
      a_ans = await this.assessmentAnswerRepo.save(_answers)
    } catch (err) {
      console.log(err)
      return new InternalServerErrorException()
    }
    /*   let result = new Results()
      result.assessment = assessment;
      await this.resultsRepo.save(result)  */
    await this.saveDataRequests(_answers)
    // }

    if (assessment.assessment_approach === 'DIRECT') {
      let resultObj = new Results()
      resultObj.assessment = assessment;
      await this.resultsRepo.save(resultObj)

    }
    this.saveTcValue(assessment.id)



    return a_ans
  }

  // async calculateResult(assessmentId: number) {
  //   let tc_score = 0
  //   let questions = await this.assessmentQuestionRepo
  //     .createQueryBuilder('aq')
  //     .innerJoin(
  //       'aq.assessment',
  //       'assessment',
  //       'assessment.id = aq.assessmentId'
  //     )
  //     .where('assessment.id = :id', { id: assessmentId })
  //     .getMany()
  //   if (questions.length > 0) {
  //     let qIds: number[] = questions.map((q) => q.id)
  //     let answers = await this.assessmentAnswerRepo
  //       .createQueryBuilder('ans')
  //       .innerJoin(
  //         'ans.assessment_question',
  //         'question',
  //         'question.id = ans.assessmentQuestionId'
  //       )
  //       .where('question.id In (:id)', { id: qIds })
  //       .getMany()
  //     answers.forEach(ans => {
  //       tc_score += ans.score
  //     })
  //     let score = tc_score * 100
  //     let res
  //     if (score > 70 || score === 70){
  //       res =  score.toFixed(3) + '% - Highly transformational activity'
  //     } else if (score > 30 || score === 30 || score < 69 || score === 69){
  //       res =  score.toFixed(3) + '% - Mild/medium transformation potential'
  //     } else {
  //       res =  score.toFixed(3) + '% - Low transformation potential'
  //     }
  //     return {score: res}
  //   } else {
  //     return 'No questions found for this assessment'
  //   }
  // }

  async calculateResult(assessmentId: number) {
    let response: {
      process_score: number, outcome_score: number, message: string
    } = { process_score: 0, outcome_score: 0, message: '' }
    let cmAssessmentQuestions_process = await this.assessmentQuestionRepo
      .createQueryBuilder('aq')
      .innerJoin(
        'aq.assessment',
        'assessment',
        'assessment.id = aq.assessmentId'
      )
      .innerJoinAndSelect(
        'aq.characteristic',
        'characteristic',
        'characteristic.id = aq.characteristicId'
      )
      .innerJoinAndSelect(
        'characteristic.category',
        'category',
        'category.id = characteristic.category_id'
      )
      .leftJoinAndMapMany(
        'aq.assessmentAnswers',
        CMAssessmentAnswer,
        'assessmentAnswers',
        'assessmentAnswers.assessmentQuestionId = aq.id'
      )
      .where('assessment.id = :id and category.type = "process"', { id: assessmentId })
      .getMany()

    let cmAssessmentQuestions_outcome = await this.assessmentQuestionRepo
      .createQueryBuilder('aq')
      .innerJoin(
        'aq.assessment',
        'assessment',
        'assessment.id = aq.assessmentId'
      )
      .innerJoinAndSelect(
        'aq.characteristic',
        'characteristic',
        'characteristic.id = aq.characteristicId'
      )
      .innerJoinAndSelect(
        'characteristic.category',
        'category',
        'category.id = characteristic.category_id'
      )
      .leftJoinAndMapMany(
        'aq.assessmentAnswers',
        CMAssessmentAnswer,
        'assessmentAnswers',
        'assessmentAnswers.assessmentQuestionId = aq.id'
      )
      .where('assessment.id = :id and category.type = "outcome"', { id: assessmentId })
      .getMany()

    if (cmAssessmentQuestions_process.length > 0) {
      response.process_score = await this.calculateProcessResult(cmAssessmentQuestions_process)
    } else {
      response.message += 'No questions found for process. '
    }

    if (cmAssessmentQuestions_outcome.length > 0) {
      response.outcome_score = await this.calculateOutcomeResult(cmAssessmentQuestions_outcome)
    } else {
      response.message += 'No questions found for outcome. '
    }

    return response
  }

  async calculateProcessResult(questions: CMAssessmentQuestion[]) {

    /**
     * if relevant -> score * weight
     * if partially relevant -> score * weight/2
     * if not relevant -> score * 0
     * category score -> sum of characteristic scores
     * process score -> same as characteristic calculation
     */

    let categories = [...new Set(questions.map(q => q.characteristic.category.code))]
    let obj = {}

    for (let cat of categories) {
      let qs = questions.filter(o => o.characteristic.category.code === cat)
      let chs = this.group(qs, 'characteristic', 'code')
      let ch_data = Object.keys(chs).map(ch => {
        let _obj: CharacteristicData = new CharacteristicData()
        _obj.characteristic = chs[ch][0].characteristic.code
        _obj.relevance = chs[ch][0].relevance
        let weight = chs[ch][0].characteristic.cm_weight
        let score = chs[ch].reduce((accumulator, object) => {
          return accumulator + object.assessmentAnswers[0].score;
        }, 0);
        _obj.score = _obj.relevance === '0' ? 0 : (_obj.relevance === '1' ? Math.round(score * weight / 2 / 100) : Math.round(score * weight / 100))
        return _obj
      })
      let cat_data = { characteristics: ch_data, weight: qs[0].characteristic.category.cm_weight }
      obj[cat] = cat_data
    }

    let resObj = {}
    for (let key of Object.keys(obj)) {
      let score = obj[key].characteristics.reduce((accumulator, object) => {
        return accumulator + object.score;
      }, 0);
      resObj[key] = { score: score, weight: obj[key].weight }
    }

    let process_score = 0
    for (let key of Object.keys(resObj)) {
      process_score += Math.round(resObj[key].score * resObj[key].weight / 100)
    }

    return process_score
  }

  async calculateOutcomeResult(questions: CMAssessmentQuestion[]) {
    let categories = [...new Set(questions.map(q => q.characteristic.category.code))]
    let obj = {}
    for (let cat of categories) {
      let qs = questions.filter(o => o.characteristic.category.code === cat)
      let score = qs.reduce((accumulator, object) => {
        return accumulator + object.assessmentAnswers[0].score;
      }, 0);
      obj[cat] = {
        score: Math.round(score),
        weight: qs[0].characteristic.category.cm_weight
      }
    }
    let ghg_score = 0; let sdg_score = 0; let adaptation_score = 0
    let outcome_score = 0
    if (obj['SCALE_GHG']) { ghg_score += obj['SCALE_GHG'].score + obj['SUSTAINED_GHG'].score; outcome_score += (ghg_score * obj['SCALE_GHG'].weight / 100) }
    if (obj['SCALE_SD']) { sdg_score = (obj['SCALE_SD'].score + obj['SUSTAINED_SD'].score) / 2; outcome_score += (sdg_score * obj['SCALE_SD'].weight / 100) }
    if (obj['SCALE_ADAPTATION']) { adaptation_score = obj['SCALE_ADAPTATION'].score + obj['SUSTAINED_ADAPTATION'].score; outcome_score += (adaptation_score * obj['SCALE_ADAPTATION']?.weight / 100) }

    return Math.round(outcome_score)
  }

  async getResults(assessmentId: number) {
    let result = []
    let processData: { technology: any[], incentives: any[], norms: any[], } = { technology: [], incentives: [], norms: [] };
    let outcomeData: { scale_GHGs: any[], sustained_GHGs: any[], scale_SDs: any[], sustained_SDs: any[] } = { scale_GHGs: [], sustained_GHGs: [], scale_SDs: [], sustained_SDs: [] };

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

      let answers2 = await this.assessmentAnswerRepo
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
          // data:ans,
          characteristic: ans.assessment_question?.characteristic?.name,
          question: ans?.assessment_question?.question?.label,
          score: ans?.answer?.label,
          justification: ans?.assessment_question?.comment,
          document: ans?.assessment_question?.uploadedDocumentPath,
          category: ans?.assessment_question?.characteristic?.category,
          starting_situation: ans?.assessment_question?.startingSituation,
          expected_impacts: ans?.assessment_question?.expectedImpact,
          SDG: ans?.assessment_question?.selectedSdg,
          outcome_score: ans?.selectedScore,
          adaptation_co_benifit: ans?.assessment_question?.adaptationCoBenifit

        }
        if (obj?.category?.code == 'TECHNOLOGY') {
          processData.technology.push(obj)
        }
        else if (obj?.category?.code == 'INCENTIVES') {
          processData.incentives.push(obj)
        }
        else if (obj?.category?.code == 'NORMS') {
          processData.norms.push(obj)
        }

        if (obj?.category?.code == 'SCALE_GHG') {
          outcomeData.scale_GHGs.push(obj)
        }
        else if (obj?.category?.code == 'SUSTAINED_GHG') {
          outcomeData.sustained_GHGs.push(obj)
        }
        else if (obj?.category?.code == 'SCALE_SD') {
          outcomeData.scale_SDs.push(obj)
        }
        else if (obj?.category?.code == 'SUSTAINED_SD') {
          outcomeData.sustained_SDs.push(obj)
        }



      })

      answers2.forEach(ans => {
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
        processData: await this.getProcessData(assessmentId),
        outComeData: outcomeData,
      }
    }
  }

  async getProcessData(assessmentId: number) {
    let cmAssessmentQuestions = await this.assessmentQuestionRepo
      .createQueryBuilder('aq')
      .innerJoin(
        'aq.assessment',
        'assessment',
        'assessment.id = aq.assessmentId'
      )
      .innerJoinAndSelect(
        'aq.characteristic',
        'characteristic',
        'characteristic.id = aq.characteristicId'
      )
      .innerJoinAndSelect(
        'characteristic.category',
        'category',
        'category.id = characteristic.category_id'
      )
      .leftJoinAndMapMany(
        'aq.assessmentAnswers',
        CMAssessmentAnswer,
        'assessmentAnswers',
        'assessmentAnswers.assessmentQuestionId = aq.id'
      )
      .leftJoinAndMapOne(
        'assessmentAnswers.answer',
        CMAnswer,
        'answer',
        'answer.id = assessmentAnswers.answerId'
      ).leftJoinAndMapOne(
        'answer.question',
        CMQuestion,
        'question',
        'question.id = answer.questionId'
      )
      .where('assessment.id = :id and category.type = "process"', { id: assessmentId })
      .getMany()

    let categories = cmAssessmentQuestions.map(q => q.characteristic.category)
    let uniqueCats = [
      ...new Map(categories.map((item) => [item["code"], item])).values(),
  ];
    let data = []
    let maxLength = 0;

    for (let cat of uniqueCats) {
      let qs = cmAssessmentQuestions.filter(o => o.characteristic.category.code === cat.code)
      let chs = this.group(qs, 'characteristic', 'code')
      let ch_data = Object.keys(chs).map(ch => {
        if (chs[ch].length > maxLength) {
          maxLength = chs[ch].length;
        }
        let _obj = {}
        _obj['name'] = chs[ch][0].characteristic.name
        _obj['relevance'] = chs[ch][0].relevance
        let questions = []
        for (let q of chs[ch]) {
          let o = new QuestionData()
          o.question = q.assessmentAnswers[0].answer.question.label
          o.weight = q.assessmentAnswers[0].answer.weight
          o.score = q.assessmentAnswers[0].answer.score_portion
          questions.push(o)
        }
        _obj['questions'] = questions
        return _obj
      })
      data.push({
        name: cat.name,
        characteristic: ch_data
      })
    }

    data = data.map(_data => {
      let chs =  _data.characteristic.map(ch => {
        if (ch.questions.length < maxLength){
          while (ch.questions.length < maxLength){
            ch.questions.push(new QuestionData())
          }
        }
        return ch
      })
      return {name: _data.name, characteristic: chs}
    })

    let guiding_questions = []

    for (let i = 0; i < maxLength; i++) {
      let obj = {}
      data.map(_data => {
        _data.characteristic.map(ch => {
          obj[ch.name + 'question'] = ch.questions[i].question
          obj[ch.name + 'weight'] = ch.questions[i].weight
          obj[ch.name + 'score'] = ch.questions[i].score
        })
      })
      guiding_questions.push(obj)
    }

    let response = {
      data: data,
      guidingQuestions: guiding_questions
    }
    return response

  }

 

  group(list: any[], prop: string | number, prop2?: string | number) {
    if (prop2) {
      return list.reduce((groups, item) => ({
        ...groups,
        [item[prop][prop2]]: [...(groups[item[prop][prop2]] || []), item]
      }), {});
    } else {
      return list.reduce((groups, item) => ({
        ...groups,
        [item[prop]]: [...(groups[item[prop]] || []), item]
      }), {});
    }
  }


  async saveTcValue(assessmentId: number) {
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
        .set({ tc_value: score })
        .where("id = :id", { id: assessmentId })
        .execute()

    }

  }

  async saveDataRequests(answers: CMAssessmentAnswer[]) {
    let requests = []
    answers.forEach(ans => {
      if (ans.institution !== undefined) {
        let request = new ParameterRequest()
        request.tool = Tool.CM_tool
        request.cmAssessmentAnswer = ans

        requests.push(request)
      }
    })

    await this.parameterRequestRepo.save(requests)
  }
}

export class CharacteristicData {
  characteristic: string
  relevance: string
  ch_weight: number
  score: number
}

export class QuestionData {
  question: string = '-'
  weight: string = '-'
  score: string = '-'
}


