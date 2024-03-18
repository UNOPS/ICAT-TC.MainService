import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ClimateAction } from './entity/climate-action.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { ProjectStatus } from 'src/master-data/project-status/project-status.entity';
import { ProjectApprovalStatus } from 'src/master-data/project-approval-status/project-approval-status.entity';
import { PolicyBarriers } from './entity/policy-barriers.entity';
import { Repository } from 'typeorm';
import { PolicySector } from './entity/policy-sectors.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entity/user.entity';
import { Country } from 'src/country/entity/country.entity';
import { Institution } from 'src/institution/entity/institution.entity';
import { AllBarriersSelected } from './dto/selected-barriers.dto';
import { BarrierCategory } from './entity/barrier-category.entity';
import { Results } from 'src/methodology-assessment/entities/results.entity';
import { Report } from 'src/report/entities/report.entity';
import { AssessmentService } from 'src/assessment/assessment.service';

@Injectable()
export class ProjectService extends TypeOrmCrudService<ClimateAction> {

  constructor(
    @InjectRepository(ClimateAction) repo,
    @InjectRepository(PolicyBarriers) public PolicyBarriersRepo: Repository<PolicyBarriers>,
    @InjectRepository(PolicySector) private readonly PolicySectorsRepo: Repository<PolicySector>,
    @InjectRepository(BarrierCategory) private barrierCategoryRepo: Repository<BarrierCategory>,
    @InjectRepository(Results) private readonly resultRepository: Repository<Results>,
    @InjectRepository(Report) private readonly reportRepository: Repository<Report>,
    private userService: UsersService,
    private assessmentService: AssessmentService,

  ) {
    super(repo);
  }

  async create(req: ClimateAction): Promise<ClimateAction> {
    let a = await this.repo.save(req)
    return a

  }

  async getProjectDetails(
    options: IPaginationOptions,
    filterText: string,
    sectorId: number,
    statusId: number,
    mitigationActionTypeId: number,
    editedOn: string,
  ): Promise<Pagination<ClimateAction>> {
    let filter: string = 'dr.status ';

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(dr.policyName LIKE :filterText OR dr.contactPersoFullName LIKE :filterText OR sec.name LIKE :filterText OR mit.name LIKE :filterText OR pst.name LIKE :filterText OR dr.editedOn LIKE :filterText)';
    }

    if (sectorId != 0) {
      if (filter) {
        filter = `${filter}  and dr.sectorId = :sectorId`;
      } else {
        filter = `dr.sectorId = :sectorId`;
      }
    }

    if (statusId != 0) {
      if (filter) {
        filter = `${filter}  and dr.projectStatusId = :statusId`;
      } else {
        filter = `dr.projectStatusId = :statusId`;
      }
    }

    if (mitigationActionTypeId != 0) {
      if (filter) {
        filter = `${filter}  and dr.mitigationActionTypeId = :mitigationActionTypeId`;
      } else {
        filter = `dr.mitigationActionTypeId = :mitigationActionTypeId`;
      }
    }

    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.projectStatus',
        ProjectStatus,
        'pst',
        'pst.id = dr.projectStatusId',
      )

      .where(filter, {
        filterText: `%${filterText}%`,
        mitigationActionTypeId,
        sectorId,
        statusId,
        editedOn,
      })
      .orderBy('dr.createdOn', 'DESC');
    data.andWhere('not dr.status = -20 ')
    let result = await paginate(data, options);


    if (result) {
      return result;
    }
  }
  async save(req: AllBarriersSelected) {
    await this.assessmentService.deleteBarriers(req.assessment.id)
    for (let re of req.allBarriers) {
      let policyBarrier = new PolicyBarriers()
      policyBarrier.barrier = re.barrier;
      policyBarrier.climateAction = req.climateAction;
      policyBarrier.explanation = re.explanation;
      policyBarrier.is_affected = re.affectedbyIntervention;
      policyBarrier.assessment = req.assessment;
      let barrier = await this.PolicyBarriersRepo.save(policyBarrier);

      for (let char of re.characteristics) {
        let barrierCategory = new BarrierCategory()
        barrierCategory.barriers = barrier;
        barrierCategory.characteristics = char;
        barrierCategory.climateAction = req.climateAction;
        barrierCategory.assessment = req.assessment;
        let result = await this.barrierCategoryRepo.save(barrierCategory);
      }
    }
    return req;
  }

  async savepolicySectors(req: PolicySector[]) {
    for (let re of req) {

      await this.PolicySectorsRepo.save(re);
    }
    return req;
  }



  async allProject(
    options: IPaginationOptions,
    filterText: number) {

    const policies = await this.repo.createQueryBuilder('climateAction')
      .select(['climateAction.id', 'climateAction.policyName'])
      .where('projectApprovalStatusId=' + filterText)
      .getMany();
    return policies
  }



  async findAllPolicies(): Promise<ClimateAction[]> {

    let user = this.userService.currentUser();
    let res = this.repo.find({
      relations: [],
    });

    let policyList: ClimateAction[] = [];

    const currentUser = await user;
    const isUserExternal = currentUser?.userType?.description === 'External';

    for (const x of await res) {
      const isSameUser = x.user?.id === currentUser?.id;
      const isMatchingCountry = x.user?.country?.id === currentUser?.country?.id;
      const isUserInternal = x.user?.userType?.description !== 'External';

      if (((isUserExternal && isSameUser) || (!isUserExternal && isMatchingCountry && isUserInternal)) && (x.status != -20)) {
        policyList.push(x);
      }
    }


    return policyList
  }
  async findAllPoliciesForReport(): Promise<ClimateAction[]> {

    let user = this.userService.currentUser();


    let reports = await this.reportRepository.find({
      relations: ['climateAction'],
    });
    let policyList: ClimateAction[] = [];



    const currentUser = await user;
    const isUserExternal = currentUser?.userType?.description === 'External';

    for (const x of await reports) {
      const isSameUser = x.climateAction.user?.id === currentUser?.id;
      const isMatchingCountry = x.climateAction.user?.country?.id === currentUser?.country?.id;
      const isUserInternal = x.climateAction.user?.userType?.description !== 'External';

      if (((isUserExternal && isSameUser) || (!isUserExternal && isMatchingCountry && isUserInternal)) && (x.climateAction.status != -20)) {
        policyList.push(x.climateAction);
      }
    }


    return policyList
  }
  async getIntervention(id: number): Promise<ClimateAction> {
    const policy = await this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.projectStatus',
        ProjectStatus,
        'pst',
        'pst.id = dr.projectStatusId',
      )
      .leftJoinAndMapOne(
        'dr.projectApprovalStatus',
        ProjectApprovalStatus,
        'pas',
        'pas.id = dr.projectApprovalStatusId',
      )
      .leftJoinAndMapOne(
        'dr.user',
        User,
        'user',
        'user.id = dr.user_id',
      )
      .leftJoinAndMapOne(
        'user.country',
        Country,
        'cntry',
        'cntry.id = user.countryId',
      )
      .leftJoinAndMapOne(
        'dr.country',
        Country,
        'country',
        'country.id = dr.countryId',
      )
      .leftJoinAndMapOne(
        'user.institution',
        Institution,
        'ins',
        'ins.id = user.institutionId',
      )
      .where("dr.id = :id", { id: id })
      .getOne()

    return policy;
  }



  async findTypeofAction(): Promise<any[]> {
    const currentUser = await this.userService.currentUser();

    const res = await this.resultRepository
      .createQueryBuilder('result')
      .leftJoinAndSelect('result.assessment', 'assessment')
      .leftJoinAndSelect('assessment.user', 'user')
      .leftJoinAndSelect('user.country', 'country')
      .getMany();


    const policyList: Results[] = [];
    const isUserExternal = currentUser?.userType?.description === 'External';

    for (const x of res) {

      const isSameUser = x.assessment?.user?.id === currentUser?.id;
      const isMatchingCountry = x.assessment?.user?.country?.id === currentUser?.country?.id;
      const isUserInternal = x.assessment?.user?.userType?.description !== 'External';
      const toolName =
        x.assessment?.tool === "PORTFOLIO" ? "General" :
          x.assessment?.tool === "CARBON_MARKET" ? "Carbon Market" :
          x.assessment?.tool === "INVESTOR" ? "Investment" :
          x.assessment?.tool;
    
          if(x?.assessment?.tool){
            
            x.assessment.tool = toolName;
          }
        
        if ((isUserExternal && isSameUser) || (!isUserExternal && isMatchingCountry && isUserInternal)) {

          policyList.push(x);
      }



    }

    const actions = policyList.reduce((acc: any[], entity: Results) => {
      const existingAction = acc.find((item) => item.name === entity.assessment.tool);

      if (existingAction) {
        existingAction.count++;
      } else {
        acc.push({ name: entity.assessment.tool, count: 1 });
      }

      return acc;
    }, []);
    const order = ["Carbon Market", "Investment", "General"];
    actions.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

    return actions;
  }



  async getAllCAList(

    options: IPaginationOptions,
    filterText: string,
    projectStatusId: number,
    projectApprovalStatusId: number,

    countryId: number,
    sectorId: number,
  ): Promise<Pagination<ClimateAction>> {
    let filter: string = '';
    let user = this.userService.currentUser();

    const currentUser = await user;
    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(dr.policyName LIKE :filterText   OR pst.name LIKE :filterText  OR pas.description LIKE :filterText )';
    }
    if (projectStatusId != 0) {
      if (filter) {
        filter = `${filter}  and dr.projectStatusId = :projectStatusId`;
      } else {
        filter = `dr.projectStatusId = :projectStatusId`;
      }
    }

    if (projectApprovalStatusId != 0) {
      if (filter) {
        filter = `${filter}  and dr.projectApprovalStatusId = :projectApprovalStatusId`;
      } else {
        filter = `dr.projectApprovalStatusId = :projectApprovalStatusId`;
      }
    }

    if (countryId != 0) {
      if (filter) {
        filter = `${filter}  and dr.countryId = :countryId`;
      } else {
        filter = `dr.countryId = :countryId`;
      }
    }

    if (sectorId != 0) {
      if (filter) {
        filter = `${filter}  and dr.sectorId = :sectorId`;
      } else {
        filter = `dr.sectorId = :sectorId`;
      }
    }

    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.projectStatus',
        ProjectStatus,
        'pst',
        'pst.id = dr.projectStatusId',
      )
      .leftJoinAndMapOne(
        'dr.projectApprovalStatus',
        ProjectApprovalStatus,
        'pas',
        'pas.id = dr.projectApprovalStatusId',
      )
      .leftJoinAndMapOne(
        'dr.user',
        User,
        'user',
        'user.id = dr.user_id',
      )
      .leftJoinAndMapOne(
        'user.country',
        Country,
        'cntry',
        'cntry.id = user.countryId',
      )
      .leftJoinAndMapOne(
        'user.institution',
        Institution,
        'ins',
        'ins.id = user.institutionId',
      )

      .where(filter, {
        filterText: `%${filterText}%`,
        projectStatusId,
        projectApprovalStatusId,
        countryId,
        sectorId,
        isDelete: true,
      })
      .orderBy('dr.id', 'DESC');

    const isUserExternal = currentUser?.userType?.description === 'External';
    const isUserVerifier = currentUser?.userType?.description === 'Verifier';
    const isUsersFilterByInstitute = currentUser?.userType?.description === 'Institution Admin' || currentUser?.userType?.description === 'Data Entry Operator'
    const allowedUserTypes = [
      'Country Admin',
      'Sector Admin',
      'Country_User',
      'MRV Admin',
      'Data Collection Team',
      'QC Team',
      'Master_Admin',
    ];
    const allowedUserTypesForAcceptedInterverntions = [
      'Sector Admin',
      'Country_User',
      'MRV Admin',
      'Country Admin',
      'Master_Admin',
    ];
    if (isUserExternal || isUserVerifier) {
      data.andWhere('user.id = :userId', { userId: currentUser.id })
    }
    else if (allowedUserTypes.includes(currentUser?.userType?.description)) {
      data.andWhere('cntry.id = :countryId', { countryId: currentUser?.country?.id })
    }
    else if (isUsersFilterByInstitute) {
      data.andWhere('ins.id = :insId', { insId: currentUser?.institution?.id })
    }
    else {
      data.andWhere('cntry.id = :countryId', { countryId: currentUser?.country?.id })
    }
    if (!allowedUserTypesForAcceptedInterverntions.includes(currentUser?.userType?.description)) {
      data.andWhere('pas.id in (4)')
    }
    else {
      data.andWhere('pas.id  in (1,2,4,5)')
    }
    data.andWhere('not dr.status = -20 ')

    let result = await paginate(data, options);

    if (result) {

      return result;
    }
  }

  async getProjectName(countryIdFromTocken: number) {

    let data = this.repo.createQueryBuilder('project')
      .leftJoinAndMapOne(
        'project.country',
        Country,
        'cntry',
        `project.countryId = ${countryIdFromTocken} `,
      )
      .orderBy('project.policyName', 'ASC');
    data.andWhere('not project.status = -20 ')

    return data.getMany();
  }

  async delete(id: number) {
    let project = await this.repo.findOne({ where: { id: id } });

    project.status = -20;
    return this.repo.save(project)

  }



  async getAllProjectDetails(
    options: IPaginationOptions,
    filterText: string,
    projectStatusId: number,
    projectApprovalStatusId: number,
    assessmentStatusName: string,
    Active: number,
    countryId: number,
    sectorId: number,

  ): Promise<Pagination<ClimateAction>> {
    let filter: string = '';
    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(dr.policyName LIKE :filterText  OR dr.institution LIKE :filterText OR pas.name LIKE :filterText OR pst.name LIKE :filterText OR dr.contactPersoFullName LIKE :filterText  OR dr.editedOn LIKE :filterText OR dr.createdOn LIKE :filterText OR dr.acceptedDate LIKE :filterText)';
    }

    if (projectStatusId != 0) {
      if (filter) {
        filter = `${filter}  and dr.projectStatusId = :projectStatusId`;
      } else {
        filter = `dr.projectStatusId = :projectStatusId`;
      }
    }

    if (projectApprovalStatusId != 0) {
      if (filter) {
        filter = `${filter}  and dr.projectApprovalStatusId = :projectApprovalStatusId`;
      } else {
        filter = `dr.projectApprovalStatusId = :projectApprovalStatusId`;
      }
    }

    if (assessmentStatusName != null && assessmentStatusName != undefined && assessmentStatusName != '') {
      if (filter) {
        filter = `${filter}  and asse.assessmentStage = :assessmentStatusName`;
      } else {
        filter = `asse.assessmentStage = :assessmentStatusName`;
      }
    }


    if (Active == 1) {
      if (filter) {
        filter = `${filter}  and pas.id != 1 `;
      } else {
        filter = `pas.id != 1`;
      }
    }
    else if (Active == 2) {
      if (filter) {
        filter = `${filter}  and pas.id = 3 `;
      } else {
        filter = `pas.id = 3 `;
      }

    }




    if (countryId != 0) {
      if (filter) {
        filter = `${filter}  and dr.countryId = :countryId`;
      } else {
        filter = `dr.countryId = :countryId`;
      }
    }

    if (sectorId != 0) {
      if (filter) {
        filter = `${filter}  and dr.sectorId = :sectorId`;
      } else {
        filter = `dr.sectorId = :sectorId`;
      }
    }




    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.projectStatus',
        ProjectStatus,
        'pst',
        'pst.id = dr.projectStatusId',
      )
      .leftJoinAndMapOne(
        'dr.projectApprovalStatus',
        ProjectApprovalStatus,
        'pas',
        'pas.id = dr.projectApprovalStatusId',
      )
      .leftJoinAndMapMany(
        'dr.assessement',
        'asse',
        'asse.projectId = dr.id',
      )

      .where(filter, {
        filterText: `%${filterText}%`,
        projectStatusId,
        projectApprovalStatusId,
        assessmentStatusName,
        Active,
        countryId,
        sectorId,
      })
      .orderBy('dr.createdOn', 'DESC');
    data.andWhere('not dr.status = -20 ')
    let result = await paginate(data, options);

    if (result) {
      return result;
    }
  }

  async findPolicySectorData(policyID: number) {
    return this.PolicySectorsRepo.find({
      relations: ['sector'],
      where: { intervention: { id: policyID } },
    });
  }
  async update(req:ClimateAction) {
   return this.repo.save(req)
  }
  async findPolicyBarrierData(policyID: number): Promise<PolicyBarriers[]> {
    let barriers = await this.PolicyBarriersRepo.createQueryBuilder('policyBarriers')
      .leftJoinAndSelect('policyBarriers.barrierCategory', 'barrierCategory')
      .leftJoinAndSelect('barrierCategory.characteristics', 'characteristics')
      .where('policyBarriers.climateAction.id = :policyID', { policyID })
      .getMany();

    const modifiedArray = barriers.map(item => {
      return {
        ...item,
        characteristics: item.barrierCategory.map(category => category.characteristics),
      };
    });
    return modifiedArray
  }
  async getLastID(): Promise<ClimateAction[]> {
    const result = await this.repo
      .createQueryBuilder('intervention')
      .orderBy('intervention.id', 'DESC')
      .take(1)
      .getMany();
    return result
  }


}
