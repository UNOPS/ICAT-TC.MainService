import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { Assessment } from './entities/assessment.entity';
import {
  IPaginationOptions,
  paginate,
} from 'nestjs-typeorm-paginate';
import { ClimateAction } from 'src/climate-action/entity/climate-action.entity';
import { Methodology } from 'src/methodology-assessment/entities/methodology.entity';
import { UsersService } from 'src/users/users.service';
import { MethodologyAssessmentParameters } from 'src/methodology-assessment/entities/methodology-assessment-parameters.entity';
import { Institution } from 'src/institution/entity/institution.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { DataVerifierDto } from './dto/dataVerifier.dto';
import { Sector } from 'src/master-data/sector/entity/sector.entity';
import { ProjectStatus } from 'src/master-data/project-status/project-status.entity';
import { Category } from 'src/methodology-assessment/entities/category.entity';
import { Characteristics } from 'src/methodology-assessment/entities/characteristics.entity';
import { Indicators } from 'src/methodology-assessment/entities/indicators.entity';
import { AssessmentObjectives } from 'src/methodology-assessment/entities/assessmentobjectives.entity';
import { Repository } from 'typeorm';
import { Objectives } from 'src/methodology-assessment/entities/objectives.entity';
import { PolicySector } from 'src/climate-action/entity/policy-sectors.entity';
import { InvestorSector } from 'src/investor-tool/entities/investor-sector.entity';
import { InvestorAssessment } from 'src/investor-tool/entities/investor-assessment.entity';
import { PortfolioSdg } from 'src/investor-tool/entities/portfolio-sdg.entity';
import { SdgAssessment } from 'src/investor-tool/entities/sdg-assessment.entity';
import { PolicyBarriers } from 'src/climate-action/entity/policy-barriers.entity';
import { BarrierCategory } from 'src/climate-action/entity/barrier-category.entity';
import { GeographicalAreasCovered } from 'src/investor-tool/entities/geographical-areas-covered.entity';
import { AssessmentCMDetail } from 'src/carbon-market/entity/assessment-cm-detail.entity';
import { InvestorToolService } from 'src/investor-tool/investor-tool.service';
import { PortfolioAssessment } from 'src/portfolio/entities/portfolioAssessment.entity';
import { Results } from 'src/methodology-assessment/entities/results.entity';
import { CMAssessmentQuestionService } from 'src/carbon-market/service/cm-assessment-question.service';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class AssessmentService extends TypeOrmCrudService<Assessment> {

  constructor(
    @InjectRepository(Assessment) repo,
    @InjectRepository(AssessmentObjectives) private assessmentObjectivesRepo: Repository<AssessmentObjectives>,
    @InjectRepository(PortfolioAssessment) private portfolioAssessmentRepo: Repository<PortfolioAssessment>,
    @InjectRepository(Results) private resultsRepo: Repository<Results>,
    @InjectRepository(SdgAssessment) private sdgAssessmentRepo: Repository<SdgAssessment>,
    @InjectRepository(PolicyBarriers) private policyBarrierRepo: Repository<PolicyBarriers>,
    @InjectRepository(BarrierCategory) private barrierCategoryRepo: Repository<BarrierCategory>,
    private readonly userService: UsersService,
    private  investorService: InvestorToolService,
    private cmAssessmentQuestionService: CMAssessmentQuestionService
  ) {
    super(repo);
  }
  create(createAssessmentDto: CreateAssessmentDto) {
    return 'This action adds a new assessment';
  }

  findAll() {
    return `This action returns all assessment`;
  }

  async findbyID(id: number) {

    let data = await this.repo
      .createQueryBuilder('asse')

      .leftJoinAndMapOne(
        'asse.climateAction',
        ClimateAction,
        'proj',
        `proj.id = asse.climateAction_id and not proj.status =-20 `,
      )
      .leftJoinAndMapMany(
        'proj.policySector',
        PolicySector,
        'policySector',
        `policySector.intervention_id = proj.id`,
      )
      .leftJoinAndMapOne(
        'policySector.sector',
        Sector,
        'pol_sector',
        `pol_sector.id = policySector.sector_id`,
      )
      .leftJoinAndMapOne(
        'asse.methodology',
        Methodology,
        'meth',
        `meth.id = asse.methodology_id`,
      )
      .leftJoinAndMapMany(
        'asse.policy_barrier',
        PolicyBarriers,
        'policy_barrier',
        `policy_barrier.assessmentId = asse.id`,
      )
      .leftJoinAndMapMany(
        'policy_barrier.barrierCategory',
        BarrierCategory,
        'barrierCategory',
        `barrierCategory.barriersId = policy_barrier.id`,
      )
      .leftJoinAndMapMany(
          'policy_barrier.characteristics',
          Characteristics,
          'characteristics',
          `characteristics.id = barrierCategory.characteristicsId`,
      )
      .leftJoinAndMapMany(
        'asse.investor_sector',
         InvestorSector,
        'investor_sector',
        `investor_sector.assessment_id = asse.id`,
      )
      .leftJoinAndMapMany(
        'asse.sector',
         Sector,
        'sector',
        'sector.id = investor_sector.sector_id'
      )
      .leftJoinAndMapMany(
        'asse.geographicalAreasCovered',
          GeographicalAreasCovered,
        'geographicalAreas',
        'geographicalAreas.assessmentId = asse.id'
      )
      .where({ id: id })
      .getOne();
      
    return data;
  }

  async update(id: number, updateAssessmentDto: UpdateAssessmentDto) {
    let ass =await this.repo.findOne({ where: { id: id }});
    ass.qaDeadline = updateAssessmentDto.deadline;
    ass.editedOn = updateAssessmentDto.editedOn;
    ass.verificationStatus = updateAssessmentDto.verificationStatus;
    return await this.repo.save(ass);
  }

  remove(id: number) {
    return `This action removes a #${id} assessment`;
  }

  async assessmentYearForManageDataStatus(
    options: IPaginationOptions,
    filterText: string,
    projectStatusId: number,
    projectApprovalStatusId: number,
    isProposal: number,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,

  ): Promise<any> {

    let filter: string = '';

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(proj.policyName LIKE :filterText OR asse.assessmentType LIKE :filterText)';
    }
    if (projectStatusId != 0) {
      if (filter) {
        filter = `${filter}  and proj.projectStatusId = :projectStatusId`;
      } else {
        filter = ` proj.projectStatusId = :projectStatusId`;
      }
    }
    if (projectApprovalStatusId != 0) {
      if (filter) {
        filter = `${filter}  and proj.projectApprovalStatusId = :projectApprovalStatusId`;
      } else {
        filter = `proj.projectApprovalStatusId = :projectApprovalStatusId`;
      }
    }
    if (sectorIdFromTocken != 0) {
      let arr =  sectorIdFromTocken.toString() ;
         arr = '(' + arr+ ")";
      if (filter) {
        filter = `${filter}  and proj.sectorId in arr`;
      } else {
        filter = `proj.sectorId in arr`;
      }
    }


    let data = this.repo
      .createQueryBuilder('asse')

      .leftJoinAndMapOne(
        'asse.climateAction',
        ClimateAction,
        'proj',
        `proj.id = asse.climateAction_id and not proj.status =-20 and proj.countryId = ${countryIdFromTocken}`,
      )
      .where(filter, {
        filterText: `%${filterText}%`,
        isProposal,
        projectStatusId,
        projectApprovalStatusId,
        sectorIdFromTocken,
      })

    let result = await paginate(data, options);
    if (result) {
      return result;
    }
  }

  async assessmentInprogress(
    options: IPaginationOptions,
    filterText: string,
    countryIdFromTocken: number,
    cuserRoleFromTocken,
    userNameFromTocken
  ): Promise<any> {
    let filter: string = 'asse.isDraft = true';
    if (cuserRoleFromTocken != "External") {
      filter = `${filter} AND proj.countryId = ${countryIdFromTocken}`;
    }
    if (cuserRoleFromTocken != "Country Admin") {
      let userItem = await this.userService.findByUseremail(userNameFromTocken);
      filter = `${filter} AND asse.user_id =${userItem.id}`
    }

    if (filterText != null && filterText != undefined && filterText != '') {
      filter = `${filter} AND (proj.policyName LIKE :filterText OR proj.typeofAction LIKE :filterText  OR asse.assessmentType LIKE :filterText OR asse.tool LIKE :filterText)`;
    }
    let data3 = this.repo
    .createQueryBuilder('asse')
    .leftJoinAndMapOne(
      'asse.climateAction',
      ClimateAction,
      'proj',
      `proj.id = asse.climateAction_id and not proj.status =-20 `,
    )
    .where(filter, {
      filterText: `%${filterText}%`,
    })
    .orderBy('asse.id', 'ASC')
    .getMany();

  let data = this.repo
    .createQueryBuilder('asse')
    .leftJoinAndMapOne(
      'asse.climateAction',
      ClimateAction,
      'proj',
      `proj.id = asse.climateAction_id  and not proj.status =-20 `,
    )
    .where(filter, {
      filterText: `%${filterText}%`,
    })
    .orderBy('asse.id', 'ASC');
  let result = await paginate(data, options);
  let newarray = new Array();
  for (let asse of result.items) {
    newarray.push(asse.id)
  }

  let data1 = this.repo
      .createQueryBuilder('asse')
      .leftJoinAndMapOne(
        'asse.climateAction',
        ClimateAction,
        'proj',
        `proj.id = asse.climateAction_id and not proj.status =-20 `,
      )
      .leftJoinAndMapMany(
        'proj.policySector',
        PolicySector,
        'policySector',
        `proj.id = policySector.intervention_id`,
      )
      .leftJoinAndMapOne(
        'policySector.sector',
        Sector,
        'sector',
        `sector.id = policySector.sector_id`,
      )
      .leftJoinAndMapOne(
        'asse.user',
        User,
        'user',
        `user.id = asse.user_id`,
      )
      .where('asse.id in (:...newarray)', { newarray });

    let item = new Array()
    let re = new Array()
    let total: number;

    if (data1) {
      total = (await data3).length;
      item = await data1.getMany();
      re.push(total);
      re.push(item);
      return re;
    }
    

   
  }

  async getAssessmentForApproveData(
    assessmentId: number,
    userName: string,
  ): Promise<any> {
    let userItem = await this.userService.findByUserName(userName);

    var data = this.repo
      .createQueryBuilder('as')
      .leftJoinAndMapMany('as.parameters', MethodologyAssessmentParameters, 'pa', 'as.id = pa.assessment_id ',)
      .leftJoinAndMapOne('pa.institution', Institution, 'in', 'in.id = pa.institution_id',)
      .leftJoinAndMapOne('pa.parameterRequest', ParameterRequest, 'par', 'par.ParameterId = pa.id',)
      .leftJoinAndMapOne('as.project', ClimateAction, 'pr', 'pr.id = as.climateAction_id and not pr.status =-20 ')
      .where(
        `as.id = ${assessmentId} AND par.dataRequestStatus in (9,-9,11)`,
      );
    let result = await data.getOne();
    return result;
  }


  async acceptQC(updateDataRequestDto: DataVerifierDto): Promise<boolean> {
    let insSec: any;
    let inscon: any;

    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      let dataRequestItem = await this.repo.findOne({ where: { id: id }});
      let originalStatus = dataRequestItem.qaStatus;
      dataRequestItem.qaStatus = updateDataRequestDto.status;

      this.repo.save(dataRequestItem).then((res) => {
      });
    }
    return true;
  }



  async checkAssessmentReadyForQC(
    assessmentId: number,
    assessmenYear: number,
  ): Promise<boolean> {
    var data = this.repo
      .createQueryBuilder('as')
      .innerJoinAndMapMany(
        'as.parameters',
        MethodologyAssessmentParameters,
        'para',
        'as.id = para.assessment_id',
      )
      .innerJoinAndMapMany(
        'para.parameterRequest',
        ParameterRequest,
        'par',
        'par.ParameterId = para.id',
      )
      .where(
        'par.UserDataEntry is not null AND as.id =' + assessmentId.toString() +')',
      );
    let totalRecordsAllStatus: any[] = await data.execute();


    var data2 = this.repo
      .createQueryBuilder('as')
      .leftJoinAndMapMany(
        'as.parameters',
        MethodologyAssessmentParameters,
        'pa',
        'as.id = pa.assessment_id',
      )
      .leftJoinAndMapMany(
        'pa.parameterRequest',
        ParameterRequest,
        'par',
        'par.ParameterId = pa.id',
      )

      .where(
        'par.dataRequestStatus in (11) AND as.id =' + assessmentId.toString() + ')',
      );
    let totalRecordsApprovedStatus: any[] = await data2.execute();
    if (totalRecordsApprovedStatus.length == totalRecordsAllStatus.length) {
      return true;
    }

    return false;
  }



  async findbyIDforReport(id: number) {

    let data = await this.repo
      .createQueryBuilder('asse')
      .leftJoinAndMapMany(
        'asse.policy_barrier',
        PolicyBarriers,
        'policy_barrier',
        `policy_barrier.assessmentId = asse.id`,
      )
      .leftJoinAndMapMany(
        'policy_barrier.barrierCategory',
        BarrierCategory,
        'barrierCategory',
        `barrierCategory.barriersId = policy_barrier.id`,
      )
      .leftJoinAndMapOne(
        'barrierCategory.characteristics',
        Characteristics,
        'characteristics',
        `characteristics.id = barrierCategory.characteristicsId`,
      )
      .leftJoinAndMapMany(
        'asse.investor_sector',
        InvestorSector,
        'investor_sector',
        `investor_sector.assessment_id = asse.id`,
      )
      .leftJoinAndMapOne(
        'investor_sector.sector',
        Sector,
        'sectorinvest',
        `sectorinvest.id = investor_sector.sector_id`,
      )
      
      .leftJoinAndMapMany(
        'asse.geographical_areas_covered',
        GeographicalAreasCovered,
        'geographical_areas_covered',
        `geographical_areas_covered.assessmentId = asse.id`,
      )
      .leftJoinAndMapOne(
        'asse.climateAction',
        ClimateAction,
        'proj',
        `proj.id = asse.climateAction_id and not proj.status =-20 `,
      )
      .leftJoinAndMapMany(
        'proj.policy_sector',
        PolicySector,
        'policy_sector',
        `proj.id = policy_sector.intervention_id`,
      )
      .leftJoinAndMapOne(
        'policy_sector.sector',
        Sector,
        'sector',
        `sector.id = policy_sector.sector_id`,
      )
      .leftJoinAndMapOne(
        'asse.methodology',
        Methodology,
        'meth',
        `meth.id = asse.methodology_id`,
      )
      .leftJoinAndMapOne(
        'proj.sector',
        Sector,
        'sec',
        `sec.id = proj.sectorId`,
      )
      .leftJoinAndMapOne(
        'proj.projectStatus',
        ProjectStatus,
        'prostatus',
        `prostatus.id = proj.projectStatusId`,
      )
      .where({ id: id })
      .getOne();
    return data;
  }
  async findbyIDforCarbonMarketReport(id: number) {

    let data = await this.repo
      .createQueryBuilder('asse')
      .leftJoinAndMapMany(
        'asse.policy_barrier',
        PolicyBarriers,
        'policy_barrier',
        `policy_barrier.assessmentId = asse.id`,
      ).leftJoinAndMapOne(
        'asse.cmAssessmentDetails',
        AssessmentCMDetail,
        'cmAssessmentDetails',
        `cmAssessmentDetails.cmassessmentId = asse.id`,
      )
      .leftJoinAndMapMany(
        'policy_barrier.barrierCategory',
        BarrierCategory,
        'barrierCategory',
        `barrierCategory.barriersId = policy_barrier.id`,
      )
      .leftJoinAndMapOne(
        'barrierCategory.characteristics',
        Characteristics,
        'characteristics',
        `characteristics.id = barrierCategory.characteristicsId`,
      )
      .leftJoinAndMapMany(
        'asse.investor_sector',
        InvestorSector,
        'investor_sector',
        `investor_sector.assessment_id = asse.id`,
      )
      .leftJoinAndMapOne(
        'investor_sector.sector',
        Sector,
        'sectorinvest',
        `sectorinvest.id = investor_sector.sector_id`,
      )
      .leftJoinAndMapMany(
        'asse.geographical_areas_covered',
        GeographicalAreasCovered,
        'geographical_areas_covered',
        `geographical_areas_covered.assessmentId = asse.id`,
      )
      .leftJoinAndMapOne(
        'asse.climateAction',
        ClimateAction,
        'proj',
        `proj.id = asse.climateAction_id and not proj.status =-20 `,
      )
      .leftJoinAndMapMany(
        'proj.policy_sector',
        PolicySector,
        'policy_sector',
        `proj.id = policy_sector.intervention_id`,
      )
      .leftJoinAndMapOne(
        'policy_sector.sector',
        Sector,
        'sector',
        `sector.id = policy_sector.sector_id`,
      )
      .leftJoinAndMapOne(
        'asse.methodology',
        Methodology,
        'meth',
        `meth.id = asse.methodology_id`,
      )
      .leftJoinAndMapOne(
        'proj.sector',
        Sector,
        'sec',
        `sec.id = proj.sectorId`,
      )
      .leftJoinAndMapOne(
        'proj.projectStatus',
        ProjectStatus,
        'prostatus',
        `prostatus.id = proj.projectStatusId`,
      )
      .where({ id: id })
      .getOne();
    return data;
  }


  async getCharacteristicasforReport(assessmentId: number,catagoryType:string,catagoryCode:string,assessmentType:string) {
    let filter: string = 'asse.id=:assessmentId ';

    if(catagoryType){
      if(filter){
        filter=`${filter} and category.type= :catagoryType `
      }else{
        filter='category.type= :catagoryType '
      }
    }
    if(catagoryCode){
      if(filter){
        filter=`${filter} and category.code= :catagoryCode `
      }else{
        filter='category.code= :catagoryCode '
      }
    }
    if(assessmentType){
      if(filter){
        filter=`${filter} and asse.type= :assessmentType `
      }else{
        filter='asse.type= :assessmentType '
      }
    }
    let data = await this.repo
      .createQueryBuilder('asse') 
    
      .leftJoinAndMapMany(
        'asse.investor_assessment',
        InvestorAssessment,
        'investor_assessment',
        `investor_assessment.assessment_id = asse.id`,
      )
      .leftJoinAndMapOne(
        'investor_assessment.category',
        Category,
        'category',
        `category.id = investor_assessment.category_id`,
      )
      .leftJoinAndMapOne(
        'investor_assessment.characteristics',
        Characteristics,
        'characteristics',
        `characteristics.id = investor_assessment.characteristic_id`,
      )
      .leftJoinAndMapOne(
        'investor_assessment.portfolioSdg',
        PortfolioSdg,
        'portfolioSdg',
        `portfolioSdg.id = investor_assessment.portfolioSdg_id`,
      )
      .leftJoinAndMapOne(
        'portfolioSdg.sdg_assessment',
        SdgAssessment,
        'sdg_assessment',
        `sdg_assessment.sdgId = portfolioSdg.id and sdg_assessment.assessmentId=asse.id`,
      )
    
      .where(filter,{ assessmentId,catagoryType,assessmentType,catagoryCode });
    return await data.getOne();
  }
  async getResultforReport(assessmentId: number,catagoryType:string,assessmentType:string) {
    let filter: string = 'asse.id=:assessmentId and parameters.isCategory=true';

    if(catagoryType){
      if(filter){
        filter=`${filter} and category.type= :catagoryType `
      }else{
        filter='category.type= :catagoryType '
      }
    }
    if(assessmentType){
      if(filter){
        filter=`${filter} and asse.type= :assessmentType `
      }else{
        filter='asse.type= :assessmentType '
      }
    }
    let data = await this.repo
      .createQueryBuilder('asse') 

    
      .leftJoinAndMapMany(
        'asse.parameters',
        MethodologyAssessmentParameters,
        'parameters',
        `parameters.assessment_id = asse.id`,
      )
      .leftJoinAndMapOne(
        'parameters.category',
        Category,
        'category',
        `category.id = parameters.category_id`,
      )
      .leftJoinAndMapOne(
        'parameters.characteristics',
        Characteristics,
        'characteristics',
        `characteristics.id = parameters.characteristics_id`,
      )
      .leftJoinAndMapOne(
        'parameters.indicator',
        Indicators,
        'indicator',
        `indicator.id = parameters.indicator_id`,
      )
      .where(filter,{ assessmentId,catagoryType,assessmentType });
    return await data.getOne();
  }
  async getAssessmentObjectiveforReport(assessmentId: number) {
    let filter: string = 'asseobj.assessment_id=:assessmentId';


    let data = await this.assessmentObjectivesRepo
      .createQueryBuilder('asseobj') 
      .leftJoinAndMapOne(
        'asseobj.objectives',
        Objectives,
        'objectives',
        `objectives.id = asseobj.objective_id`,
      )
      
      .where(filter,{ assessmentId });
    return await data.getMany();
  }

  async deleteAssessment(id:number, tool: string): Promise<any>{
    try {
      if(tool == 'PORTFOLIO' || tool == 'INVESTOR'){
        await this.investorService.deleteAssessment(id)
      } else if (tool === 'CARBON_MARKET') {
        await this.cmAssessmentQuestionService.deleteCMAssessment(id);
      }
      
      let portfolioAssessment = await this.getPortfolioAssessmnet(id)
      if(portfolioAssessment){
        await this.portfolioAssessmentRepo.delete({id:portfolioAssessment.id})
      }
      await this.deleteBarriers(id)
      await this.resultsRepo.delete({assessment:{id: id}})
      await this.sdgAssessmentRepo.delete({assessment:{id: id}})
      await this.repo.delete({id:id})
      return true
      
    } catch (error) {
      return false
    }

  }
  async deleteBarriers(id: number){
    let policyBarriers = await this.getPolicyBarriers(id);
      if(policyBarriers){
        await this.deleteBarrierCategories(policyBarriers)
      }
      await this.policyBarrierRepo.delete({assessment:{id:id}})
  }

  async getPortfolioAssessmnet(id:number){
    let portfolioAssessment =  this.portfolioAssessmentRepo.createQueryBuilder('portfolioAssess')
    .leftJoinAndMapOne(
      'portfolioAssess.assessment',
      Assessment,
      'assess',
      'assess.id = portfolioAssess.assessment_id'
    )
    .where('assess.id = :value', { value: id })
    .getOne()
    return await portfolioAssessment
  }

  async getPolicyBarriers(asseId: number) {
    try {
      let policy_barrier = this.policyBarrierRepo.createQueryBuilder('policy_barrier')
        .leftJoinAndMapMany(
          'policy_barrier.barrierCategory',
          BarrierCategory,
          'barrierCategory',
          'barrierCategory.barriersId = policy_barrier.id',
        )
        .leftJoinAndMapOne(
          'policy_barrier.assessment',
          Assessment,
          'assessment',
          `assessment.id = policy_barrier.assessmentId`,
        )
        .where('assessment.id = :value', { value: asseId })
        .getMany()

        return await policy_barrier
    
    } catch (error) {
    }
  }
  async deleteBarrierCategories(polcybarrier: PolicyBarriers[]) {
    try {
      for await (let barrier of polcybarrier) {
        if(barrier.barrierCategory){
          this.barrierCategoryRepo.delete({barriers:{id:barrier.id}})
        }
      }
     
    } catch (error) {
    }
  }
}
