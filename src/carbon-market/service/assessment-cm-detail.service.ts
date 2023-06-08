import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { AssessmentCMDetail } from "../entity/assessment-cm-detail.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CMAssessmentAnswer } from "../entity/cm-assessment-answer.entity";
import { Repository } from "typeorm";
import { CMAssessmentQuestion } from "../entity/cm-assessment-question.entity";
import { Assessment } from "src/assessment/entities/assessment.entity";


@Injectable()
export class AssessmentCMDetailService extends TypeOrmCrudService<AssessmentCMDetail> {
 
  
  constructor(
    @InjectRepository(AssessmentCMDetail) repo,
    @InjectRepository(CMAssessmentAnswer) private assessmentAnswerRepo: Repository<CMAssessmentAnswer>,
    @InjectRepository(CMAssessmentQuestion)  private assessmentQuestionRepo: Repository<CMAssessmentQuestion>,
    @InjectRepository(AssessmentCMDetail)  private assessmentCMDetailsRepo: Repository<AssessmentCMDetail>,
    @InjectRepository(Assessment) private readonly assessmentRepo: Repository<Assessment>,
   
   
    
  ) {
    super(repo);
  }

  getAssessmentCMDetailByAssessmentId(assessmentId: number){
    let data = this.repo.createQueryBuilder('detail')
    .innerJoin(
      'detail.cmassessment',
      'assessment',
      'assessment.id = detail.cmassessmentId'
    )
    .where('assessment.id = :id', {id: assessmentId})

    return data.getOne()
  }


  async getPrerequisite(): Promise<any> {
    let tool = 'Carbon Market Tool';
    // let qustionCode ='S-2-C-3-Q-2';
    let answerCode1 ='S-2-C-3-Q-2-A-2'; //no
    let answerCode2 ='S-2-C-3-Q-2-A-3'; // not sure

    
    let totolCount = await this.assessmentRepo
      .createQueryBuilder('assessment')
      .where('assessment.tool = :value', { value: tool })
      .getCount();

    let passedCount = await this.assessmentAnswerRepo
      .createQueryBuilder('assessmentAnswer')
      .leftJoinAndSelect('assessmentAnswer.answer','answer')
      .where('answer.code = :value1 OR answer.code = :value2', {  value1:answerCode1,value2:answerCode2 })
      .getCount();

      
    let failedCount=totolCount-passedCount
      
    return[ {sector:'passed',count:passedCount},
            {sector:'failed',count:failedCount}]
          
    
      

   
  }

  async getSectorCount(): Promise<any> {
    const result = await this.assessmentCMDetailsRepo
    // .createQueryBuilder('assessment_cm_detail')
    // .select('assessment_cm_detail.sectoral_boundary', 'sectoral_boundary')
    // .addSelect('ROUND(AVG(assessment_cm_detail.tc_value), 2)', 'average_tc_value')
    // .groupBy('assessment_cm_detail.sectoral_boundary')
    // .getRawMany();
    .createQueryBuilder('assessment_cm_detail')
    .leftJoin('assessment_cm_detail.cmassessment', 'assessment')
    .select('assessment_cm_detail.sectoral_boundary', 'sectoral_boundary')
    .addSelect('ROUND(AVG(assessment.tc_value),2)', 'average_tc_value')
    .groupBy('assessment_cm_detail.sectoral_boundary')
    .having('average_tc_value IS NOT NULL')
    .getRawMany();

    // console.log(result);
    return result
  }
}




