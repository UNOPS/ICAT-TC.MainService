import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { AssessmentCMDetail } from "../entity/assessment-cm-detail.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CMAssessmentAnswer } from "../entity/cm-assessment-answer.entity";
import { Repository } from "typeorm";
import { CMAssessmentQuestion } from "../entity/cm-assessment-question.entity";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/entity/user.entity";
import { Country } from "src/country/entity/country.entity";
import { ClimateAction } from "src/climate-action/entity/climate-action.entity";
import { CMAnswer } from "../entity/cm-answer.entity";


@Injectable()
export class AssessmentCMDetailService extends TypeOrmCrudService<AssessmentCMDetail> {
 
  
  constructor(
    @InjectRepository(AssessmentCMDetail) repo,
    @InjectRepository(CMAssessmentAnswer) private assessmentAnswerRepo: Repository<CMAssessmentAnswer>,
    @InjectRepository(CMAssessmentQuestion)  private assessmentQuestionRepo: Repository<CMAssessmentQuestion>,
    @InjectRepository(AssessmentCMDetail)  private assessmentCMDetailsRepo: Repository<AssessmentCMDetail>,
    @InjectRepository(Assessment) private readonly assessmentRepo: Repository<Assessment>,
    private userService: UsersService,
   
    
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
    let user = this.userService.currentUser();
    const currentUser = await user;
    const isUserExternal = currentUser?.userType?.name === 'External';
    
    console.log("........",currentUser?.userType?.name)
    let totolAssess = await this.assessmentRepo
      .createQueryBuilder('assessment')
      .leftJoinAndMapOne(
        'assessment.user',
         User,
        'user',
        'user.id = assessment.user_id',
      )
      .leftJoinAndMapOne(
        'assessment.climateAction',
        ClimateAction,
        'ca',
        'ca.id = assessment.climateAction_id',
      )
      .leftJoinAndMapOne(
        'ca.country',
         Country,
        'cntry',
        'cntry.id = ca.countryId',
      )
      .where('assessment.tool = :value', { value: tool })
      // .andWhere('assessment.tc_value IS NOT NULL')
      
      if(isUserExternal){
        totolAssess.andWhere('user.id = :userId', { userId: currentUser.id })
        
      }
      else {
        totolAssess.andWhere('cntry.id = :countryId', { countryId: currentUser?.country?.id })
      
      }
      let totolCount= await totolAssess.getCount();
      // console.log("totolCount", totolCount)

   
      let passedAssess = await this.assessmentAnswerRepo
        .createQueryBuilder('assessmentAnswer')
        .innerJoinAndSelect('assessmentAnswer.answer', 'answer')
        .innerJoinAndSelect('assessmentAnswer.assessment_question', 'question')
        .innerJoinAndSelect('question.assessment', 'assessment')
        .innerJoinAndSelect('assessment.user', 'user')
        .innerJoinAndSelect('assessment.climateAction', 'ca')
        .innerJoinAndSelect('ca.country', 'cntry')
        .where('(answer.code = :value1 OR answer.code = :value2) ', { value1: answerCode1, value2: answerCode2 })
        // .getMany();

      if(isUserExternal){
        // console.log("]]]]]]")
        passedAssess.andWhere('user.id = :userId', { userId: currentUser.id })
        
      }
      else {
        passedAssess.andWhere('cntry.id = :countryId', { countryId: currentUser?.country?.id })
      
      }
      let passedCount=await passedAssess.getCount();
      // console.log("passedCount",passedCount)
      
    let failedCount= totolCount-passedCount
    // return passedAssess.getMany()
      
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




