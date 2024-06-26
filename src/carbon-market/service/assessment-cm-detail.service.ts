import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
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
import { Sector } from "src/master-data/sector/entity/sector.entity";
import { Results } from "src/methodology-assessment/entities/results.entity";


@Injectable()
export class AssessmentCMDetailService extends TypeOrmCrudService<AssessmentCMDetail> {
  
  constructor(
    @InjectRepository(AssessmentCMDetail) repo,
    @InjectRepository(CMAssessmentAnswer) private assessmentAnswerRepo: Repository<CMAssessmentAnswer>,
    @InjectRepository(AssessmentCMDetail) private assessmentCMDetailsRepo: Repository<AssessmentCMDetail>,
    @InjectRepository(Assessment) private readonly assessmentRepo: Repository<Assessment>,
    private userService: UsersService,
    @InjectRepository(GeographicalAreasCovered) private geographicalAreasCoveredRepo: Repository<GeographicalAreasCovered>,
    @InjectRepository(InvestorSector) private investorSectorRepo: Repository<InvestorSector>


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
      .innerJoinAndMapOne(
        'assessment.result',
        Results,
        'result',
        'result.assessment_id  = assessment.id'
      )
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
        'ca.id = assessment.climateAction_id and not ca.status =-20 ',
      )
      .leftJoinAndMapOne(
        'ca.country',
        Country,
        'cntry',
        'cntry.id = ca.countryId',
      )
      .andWhere('assessment.tool = :value', { value: tool })

    if (isUserExternal) {
      totolAssess.andWhere('user.id = :userId', { userId: currentUser.id })

    }
    else {
      totolAssess.andWhere('cntry.id = :countryId', { countryId: currentUser?.country?.id })

    }
    let totolCount = await totolAssess.getCount();
    let totalassess = await totolAssess.getMany();
    let failed = 0;
    for await(let assess of totalassess){
      if(assess.result.averageOutcome == null && assess.result.averageOutcome == null){
        failed = failed +1;
      }
    }
    let passedCount = totolCount -failed
    let failedCount = failed
    return [{ sector: 'Passed', count: passedCount },
    { sector: 'Failed', count: failedCount }]


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
    try {
      return this.repo.save(dto);
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async deleteCmAssessmentDetail(assessmentId: number) {
    await this.deleteGeographicalAreasCovered(assessmentId);
    await this.deleteInvestorSector(assessmentId);

    try {
      await this.repo.delete({cmassessment: {id: assessmentId}});
    } catch (error) {
      throw new InternalServerErrorException();
    }

  }

  async deleteGeographicalAreasCovered(assessmentId: number){
    try {
      await this.geographicalAreasCoveredRepo.delete({assessment: {id: assessmentId}});
    
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async deleteInvestorSector(assessmentId: number) {
    try {
      await this.investorSectorRepo.delete({assessment: {id: assessmentId}});
     
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
}




