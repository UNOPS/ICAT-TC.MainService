import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { AssessmentCMDetail } from "../entity/assessment-cm-detail.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CMAssessmentAnswer } from "../entity/cm-assessment-answer.entity";
import { Repository } from "typeorm";
import { Assessment } from "src/assessment/entities/assessment.entity";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/entity/user.entity";
import { Country } from "src/country/entity/country.entity";
import { ClimateAction } from "src/climate-action/entity/climate-action.entity";
import { GeographicalAreasCovered } from "src/investor-tool/entities/geographical-areas-covered.entity";
import { InvestorSector } from "src/investor-tool/entities/investor-sector.entity";


@Injectable()
export class AssessmentCMDetailService extends TypeOrmCrudService<AssessmentCMDetail> {
  
  constructor(
    @InjectRepository(AssessmentCMDetail) repo,
    @InjectRepository(CMAssessmentAnswer) private assessmentAnswerRepo: Repository<CMAssessmentAnswer>,
    @InjectRepository(AssessmentCMDetail) private assessmentCMDetailsRepo: Repository<AssessmentCMDetail>,
    @InjectRepository(Assessment) private readonly assessmentRepo: Repository<Assessment>,
    private userService: UsersService,


  ) {
    super(repo);
  }

  getAssessmentCMDetailByAssessmentId(assessmentId: number) {
    let data = this.repo.createQueryBuilder('detail')
      .innerJoin(
        'detail.cmassessment',
        'assessment',
        'assessment.id = detail.cmassessmentId'
      )
      .leftJoinAndMapMany(
        'detail.geographicalAreasCovered',
        GeographicalAreasCovered,
        'geographicalAreas',
        'geographicalAreas.assessmentCMDetailId = detail.id'
      )
      .leftJoinAndMapMany(
        'detail.sectorsCovered',
        InvestorSector,
        'iSector',
        'iSector.assessmentCMDetailId = detail.id'
      )
      .leftJoinAndSelect(
        'iSector.sector',
        'sector',
        'sector.id = iSector.sector_id'
      )
      .where('assessment.id = :id', { id: assessmentId })

    return data.getOne()
  }


  async getPrerequisite(): Promise<any> {
    let tool = 'CARBON_MARKET';
    let answerCode1 = 'S-2-C-3-Q-2-A-2';
    let answerCode2 = 'S-2-C-3-Q-2-A-3';
    let user = this.userService.currentUser();
    const currentUser = await user;
    const isUserExternal = currentUser?.userType?.name === 'External';

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

    if (isUserExternal) {
      totolAssess.andWhere('user.id = :userId', { userId: currentUser.id })

    }
    else {
      totolAssess.andWhere('cntry.id = :countryId', { countryId: currentUser?.country?.id })

    }
    let totolCount = await totolAssess.getCount();


    let passedAssess = await this.assessmentAnswerRepo
      .createQueryBuilder('assessmentAnswer')
      .innerJoinAndSelect('assessmentAnswer.answer', 'answer')
      .innerJoinAndSelect('assessmentAnswer.assessment_question', 'question')
      .innerJoinAndSelect('question.assessment', 'assessment')
      .innerJoinAndSelect('assessment.user', 'user')
      .innerJoinAndSelect('assessment.climateAction', 'ca')
      .innerJoinAndSelect('ca.country', 'cntry')
      .where('(answer.code = :value1 OR answer.code = :value2) ', { value1: answerCode1, value2: answerCode2 })

    if (isUserExternal) {
      passedAssess.andWhere('user.id = :userId', { userId: currentUser.id })

    }
    else {
      passedAssess.andWhere('cntry.id = :countryId', { countryId: currentUser?.country?.id })

    }
    let passedCount = await passedAssess.getCount();

    let failedCount = totolCount - passedCount

    return [{ sector: 'passed', count: passedCount },
    { sector: 'failed', count: failedCount }]


  }

  async getSectorCount(): Promise<any> {
    const result = await this.assessmentCMDetailsRepo
      .createQueryBuilder('assessment_cm_detail')
      .leftJoin('assessment_cm_detail.cmassessment', 'assessment')
      .select('assessment_cm_detail.sectoral_boundary', 'sectoral_boundary')
      .addSelect('ROUND(AVG(assessment.tc_value),2)', 'average_tc_value')
      .groupBy('assessment_cm_detail.sectoral_boundary')
      .having('average_tc_value IS NOT NULL')
      .getRawMany();
    return result
  }

  save(dto: AssessmentCMDetail) {
    return this.repo.save(dto);
  }
}




