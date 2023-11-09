import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
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
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { PolicySector } from './entity/policy-sectors.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entity/user.entity';
import { Country } from 'src/country/entity/country.entity';
import { Institution } from 'src/institution/entity/institution.entity';
import { AllBarriersSelected } from './dto/selected-barriers.dto';
import { BarrierCategory } from './entity/barrier-category.entity';
import { Results } from 'src/methodology-assessment/entities/results.entity';
import { Report } from 'src/report/entities/report.entity';

@Injectable()
export class ProjectService extends TypeOrmCrudService<ClimateAction> {
 
  constructor(
    @InjectRepository(ClimateAction) repo,
    @InjectRepository(PolicyBarriers) public PolicyBarriersRepo: Repository<PolicyBarriers>,
    @InjectRepository(PolicySector) private readonly PolicySectorsRepo: Repository<PolicySector>,
    @InjectRepository(BarrierCategory) private  barrierCategoryRepo: Repository<BarrierCategory>,
    @InjectRepository(Results) private readonly resultRepository: Repository<Results>,
    @InjectRepository(Report) private readonly reportRepository: Repository<Report>,
    private userService: UsersService,
    
) {
    super(repo);
  }
 
  async create(req:ClimateAction):Promise<ClimateAction>{
    // console.log( "req",req)
    // console.log( "called")
    // let user =new User()
    // user.id = 1;
    // req.user =user;
    let a =  await this.repo.save(req)
    console.log( "saved")
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
    let filter: string = '';
    // let fDate = `${editedOn.getFullYear()}-${editedOn.getMonth()+1}-${editedOn.getDate()}`;

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        // '(dr.climateActionName LIKE :filterText OR dr.description LIKE :filterText)';
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
      console.log(filter,"----------")
      if (filter) {
        filter = `${filter}  and dr.projectStatusId = :statusId`;
      } else {
        filter = `dr.projectStatusId = :statusId`;
      }
      console.log(filter,"----------")
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
      //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')

      .where(filter, {
        filterText: `%${filterText}%`,
        mitigationActionTypeId,
        sectorId,
        statusId,
        editedOn,
      })
      .orderBy('dr.createdOn', 'DESC');
    // console.log(
    //   '=====================================================================',
    // );
    // console.log(data.getQuery());

    let resualt = await paginate(data, options);
    

    if (resualt) {
      return resualt;
    }
  }
async save(req:AllBarriersSelected){
  // console.log("AllBarriersSelected",req)
  for(let re of req.allBarriers){
    let policyBarrier = new PolicyBarriers()
    policyBarrier.barrier = re.barrier;
    policyBarrier.climateAction = req.climateAction;
    policyBarrier.explanation = re.explanation;
    policyBarrier.is_affected = re.affectedbyIntervention;
    policyBarrier.assessment =req.assessment;
    console.log("barrier",policyBarrier)
    let barrier = await this.PolicyBarriersRepo.save(policyBarrier);

    for (let char of re.characteristics) {
      let barrierCategory = new BarrierCategory()
      barrierCategory.barriers = barrier;
      barrierCategory.characteristics =char;
      barrierCategory.climateAction = req.climateAction
      barrierCategory.assessment =req.assessment;
      console.log("barrierCategory",barrierCategory)
      let result = await this.barrierCategoryRepo.save(barrierCategory);
      console.log("saved")

    }
  }
  return req;
}

async savepolicySectors(req:PolicySector[]){
  for(let re of req){
    
    await this.PolicySectorsRepo.save(re);
    console.log("saved sector")
  }
  return req;
}



async allProject(
  options: IPaginationOptions,
  filterText: number){
    // console.log("22222222222222222")

    const policies = await this.repo.createQueryBuilder('climateAction')
      .select(['climateAction.id', 'climateAction.policyName'])
      .where('projectApprovalStatusId=' + filterText)
      .getMany();
  console.log("22222222222222222",policies)
   return policies
}



  async findAllPolicies(): Promise<ClimateAction[]> {

    let user = this.userService.currentUser();
  //  console.log("ussssser : ",(await user).fullname, "and ", (await user).username, "Id :", (await user).id , "user Type", (await user)?.userType?.name, "country ID :", (await user)?.country?.id)

     let res =  this.repo.find({
        relations: [],
      });

      let policyList: ClimateAction[] = [];

   /*    if((await user)?.userType?.name === 'External')
      {
        for(let x of await res){
          if(x.user?.id == (await user)?.id ){
            policyList.push(x)
          }
        }
      }
      else{
        for(let x of await res){
          if(x.user?.country?.id == (await user)?.country?.id && (x.user?.userType?.name !==  "External") ){
            policyList.push(x)
          }
        }
      } */

    const currentUser = await user;
    const isUserExternal = currentUser?.userType?.description === 'External';

    // console.log("currreenntt", currentUser)
    for (const x of await res) {
      const isSameUser = x.user?.id === currentUser?.id;
      const isMatchingCountry = x.user?.country?.id === currentUser?.country?.id;
      const isUserInternal = x.user?.userType?.description !== 'External';

      if ((isUserExternal && isSameUser) || (!isUserExternal && isMatchingCountry && isUserInternal)) {
        policyList.push(x);
      }
    }


      return policyList
  }
  async findAllPoliciesForReport(): Promise<ClimateAction[]> {

    let user = this.userService.currentUser();

    //  let res =  this.repo.find({
    //     relations: [],
    //   });
      

      let reports = await this.reportRepository.find({
        relations: ['climateAction'],
      });
      let policyList: ClimateAction[] = [];

   

    const currentUser = await user;
    const isUserExternal = currentUser?.userType?.description === 'External';

    // console.log("currreenntt", currentUser)
    for (const x of await reports) {
      const isSameUser = x.climateAction.user?.id === currentUser?.id;
      const isMatchingCountry = x.climateAction.user?.country?.id === currentUser?.country?.id;
      const isUserInternal = x.climateAction.user?.userType?.description !== 'External';

      if ((isUserExternal && isSameUser) || (!isUserExternal && isMatchingCountry && isUserInternal)) {
        policyList.push(x.climateAction);
      }
    }


      return policyList
  }
  async getIntervention(id:number):Promise<ClimateAction> {
    const policy = await this.repo
          .createQueryBuilder("intervetion")
          .where("intervetion.id = :id", { id: id })
          .getOne()

    return policy;
  }
  
 /*  async findTypeofAction(): Promise<any[]> {
    const actions = await this.repo
      .createQueryBuilder('entity')
      .select('entity.typeofAction', 'name')
      .addSelect('COUNT(*)', 'count')
      .groupBy('entity.typeofAction')
      .getRawMany();

    return actions.map(({ name, count }) => ({ name, count }));
  } */

  /* async findTypeofAction(): Promise<any[]> {
    const currentUser = await this.userService.currentUser();
  
    const res = await this.repo.find({
      relations: [],
    });
  
    const policyList: ClimateAction[] = [];
    const isUserExternal = currentUser?.userType?.name === 'External';
  
    for (const x of res) {
      const isSameUser = x.user?.id === currentUser?.id;
      const isMatchingCountry = x.user?.country?.id === currentUser?.country?.id;
      const isUserInternal = x.user?.userType?.name !== 'External';
  
      if ((isUserExternal && isSameUser) || (!isUserExternal && isMatchingCountry && isUserInternal)) {
        policyList.push(x);
      }
    }
  
    const actions = policyList.reduce((acc: any[], entity: ClimateAction) => {
      const existingAction = acc.find((item) => item.name === entity.typeofAction);
  
      if (existingAction) {
        existingAction.count++;
      } else {
        acc.push({ name: entity.typeofAction, count: 1 });
      }
  
      return acc;
    }, []);
  
    return actions;
  }  */
  

   async findTypeofAction(): Promise<any[]> {
    const currentUser = await this.userService.currentUser();
  
    console.log("userrrr", currentUser);
  
    // const res = await this.resultRepository.find({
    //   relations: ['assessment'],
    // });
    const res = await this.resultRepository
      .createQueryBuilder('result')
      .leftJoinAndSelect('result.assessment', 'assessment') // Join with assessment entity
      .leftJoinAndSelect('assessment.user', 'user')
      .leftJoinAndSelect('user.country', 'country') // Join with user entity within assessment
      .getMany();
  
    const policyList: Results[] = [];
    const isUserExternal = currentUser?.userType?.description === 'External';
  
    for (const x of res) {
      
      // if(x.assessment?.user?.id!==undefined){
        // console.log("user",  x.assessment?.user?.country?.id,currentUser?.id)
        const isSameUser = x.assessment?.user?.id === currentUser?.id;
        const isMatchingCountry = x.assessment?.user?.country?.id === currentUser?.country?.id;
        const isUserInternal = x.assessment?.user?.userType?.description !== 'External';
        // console.log("isSameUser", isSameUser,"isMatchingCountry",isMatchingCountry,"isUserInternal",isUserInternal)
    
        // Change "PORTFOLIO" to "OTHER INTERVENTIONS" and "CARBON_MARKET" to "CARBON MARKET"
        const toolName =
          x.assessment?.tool === "PORTFOLIO" ? "Other Interventions" :
          x.assessment?.tool === "CARBON_MARKET" ? "Carbon Market Tool" :
          x.assessment?.tool === "INVESTOR" ? "Investor & Private Sector Tool" :
          x.assessment?.tool;
    
          if(x?.assessment?.tool){
            
            x.assessment.tool = toolName;
          }
        
        if ((isUserExternal && isSameUser) || (!isUserExternal && isMatchingCountry && isUserInternal)) {
          policyList.push(x);
        // }
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
    // console.log("filterText",filterText)
    let filter: string = '';
    let user = this.userService.currentUser();
    
    const currentUser = await user;
    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(dr.policyName LIKE :filterText   OR pst.name LIKE :filterText  OR pas.description LIKE :filterText )';
    }
   // console.log("hello");
    if (projectStatusId != 0) {
      if (filter) {
        filter = `${filter}  and dr.projectStatusId = :projectStatusId`;
      } else {
        filter = `dr.projectStatusId = :projectStatusId`;
      }
    }
   
    if (projectApprovalStatusId != 0) {
      // console.log("projectApprovalStatusId",projectApprovalStatusId)
      if (filter) {
        // filter = `${filter}  and dr.projectApprovalStatusId  in (1,2,4,5)`;
        filter = `${filter}  and dr.projectApprovalStatusId = :projectApprovalStatusId`;
      } else {
        filter = `dr.projectApprovalStatusId = :projectApprovalStatusId`;
        // filter = `dr.projectApprovalStatusId in (1,2,4,5)`;
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
      //users filter by country id
      const isUsersFilterByInstitute=currentUser?.userType?.description === 'Institution Admin'||currentUser?.userType?.description === 'Data Entry Operator'
      console.log("user type", currentUser?.userType?.description)
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
      if (isUserExternal || isUserVerifier){
        data.andWhere('user.id = :userId', { userId: currentUser.id })
      }
      else if  (allowedUserTypes.includes(currentUser?.userType?.description)){
        // console.log("............")
        data.andWhere('cntry.id = :countryId', { countryId: currentUser?.country?.id })
      }
      else if (isUsersFilterByInstitute){
        // console.log("+++++++++++",isUsersFilterByInstitute)
        data.andWhere('ins.id = :insId', { insId: currentUser?.institution?.id  })
      }
      else{
        data.andWhere('cntry.id = :countryId', { countryId: currentUser?.country?.id })
      }
      // accpeted policies showing
      if  (!allowedUserTypesForAcceptedInterverntions.includes(currentUser?.userType?.description)){
        console.log("not allowed for accepted policies")
        data.andWhere('pas.id in (4)')
      }
      else{
        console.log("allowed for accepted policies")
        data.andWhere('pas.id  in (1,2,4,5)')
      }


    let result = await paginate(data, options);
  
    if (result) {
    
      return result;
    }
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

    if (projectStatusId !=0) {
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


// if active = 0 ---> whole climateactions list
// if active = 1 ---> all climate actions
// if active = 2 ---> active climate actions

    if (Active == 1) {
    // console.log(Active);
      if (filter) {
        filter = `${filter}  and pas.id != 1 `; // no proposed CA s all climate
      } else {
        filter = `pas.id != 1`;
      }
    } 
    else if (Active == 2) {
      //console.log(Active);
      if (filter) {
        filter = `${filter}  and pas.id = 3 `; // only active CA s
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

      //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')

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
    // console.log(
    //   '=====================================================================',
   // );
    // console.log(data.getQuery());

    let resualt = await paginate(data, options);

    if (resualt) {
      return resualt;
    }
  }

  async findPolicySectorData(policyID: number){
    return this.PolicySectorsRepo.find({
      relations: ['sector'],
      where: { intervention: { id: policyID } },
    });
  }
  
  async findPolicyBarrierData(policyID: number):Promise<PolicyBarriers[]>{
    let barriers= await this.PolicyBarriersRepo.createQueryBuilder('policyBarriers')
      .leftJoinAndSelect('policyBarriers.barrierCategory', 'barrierCategory')
      .leftJoinAndSelect('barrierCategory.characteristics', 'characteristics')
      .where('policyBarriers.climateAction.id = :policyID', { policyID })
      .getMany();

      console.log("barriers",barriers)
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
