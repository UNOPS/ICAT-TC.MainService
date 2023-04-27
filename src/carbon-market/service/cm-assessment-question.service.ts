import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CMAssessmentQuestion } from "../entity/cm-assessment-question.entity";
import { CMResultDto } from "../dto/cm-result.dto";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { CMAssessmentAnswer } from "../entity/cm-assessment-answer.entity";
import { Repository } from "typeorm-next";

@Injectable()
export class CMAssessmentQuestionService extends TypeOrmCrudService<CMAssessmentQuestion> {
  constructor(
    @InjectRepository(CMAssessmentQuestion) repo,
    @InjectRepository(CMAssessmentAnswer) 
    private assessmentAnswerRepo: Repository<CMAssessmentAnswer>
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

  saveResult(result: CMResultDto[], assessment: Assessment){
    result.forEach(async res => {
      let ass_question = new CMAssessmentQuestion()
      ass_question.assessment = assessment;
      ass_question.comment = res.comment;
      ass_question.question = res.question;

      let q_res = await this.repo.save(ass_question)
      let answers = []

      if (Array.isArray(res.answer)){
        res.answer.forEach(async ans => {
          let ass_answer = new CMAssessmentAnswer()
          ass_answer.answer = ans
          ass_answer.assessment_question = q_res
          ass_answer.score = ans.weight

          answers.push(ass_answer)
        })
      } else {
        let ass_answer = new CMAssessmentAnswer()
          ass_answer.answer = res.answer
          ass_answer.assessment_question = q_res
          ass_answer.score = res.answer.weight

          answers.push(ass_answer)
        }
        let a_ans = await this.assessmentAnswerRepo.save(answers)
    })
  }


}


