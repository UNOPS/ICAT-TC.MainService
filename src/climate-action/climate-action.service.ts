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

@Injectable()
export class ProjectService extends TypeOrmCrudService<ClimateAction> {
 
  constructor(
    @InjectRepository(ClimateAction) repo,
    @InjectRepository(PolicyBarriers) public PolicyBarriersRepo: Repository<PolicyBarriers>,
    @InjectRepository(PolicySector) private readonly PolicySectorsRepo: Repository<PolicySector>,
    private userService: UsersService,
) {
    super(repo);
  }
 
  async create(req:ClimateAction):Promise<ClimateAction>{
    // console.log( "req",req)
    return await this.repo.save(req)
     
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
async save(req:PolicyBarriers[]){
  for(let re of req){
    console.log("barrier", re)
    await this.PolicyBarriersRepo.save(re);
  }
  return req;
}

async savepolicySectors(req:PolicySector[]){
  for(let re of req){
    console.log("sector", re)
    await this.PolicySectorsRepo.save(re);
  }
  return req;
}



async allProject(
  options: IPaginationOptions,
  filterText: number){
    console.log("22222222222222222")

    const policies = await this.repo.createQueryBuilder('climateAction')
      .select(['climateAction.id', 'climateAction.policyName'])
      .where('projectApprovalStatusId=' + filterText)
      .getMany();
  console.log("22222222222222222",policies)
   return policies
}



  async findAllPolicies(): Promise<ClimateAction[]> {

    let user = this.userService.currentUser();
    console.log("ussssser : ",(await user).fullname, "and ", (await user).username, "Id :", (await user).id , "user Type", (await user)?.userType?.name, "country ID :", (await user)?.country?.id)

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
    const isUserExternal = currentUser?.userType?.name === 'External';

    for (const x of await res) {
      const isSameUser = x.user?.id === currentUser?.id;
      const isMatchingCountry = x.user?.country?.id === currentUser?.country?.id;
      const isUserInternal = x.user?.userType?.name !== 'External';

      if ((isUserExternal && isSameUser) || (!isUserExternal && isMatchingCountry && isUserInternal)) {
        policyList.push(x);
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

  async findTypeofAction(): Promise<any[]> {
    const currentUser = await this.userService.currentUser();
    console.log(
      "ussssser : ",
      currentUser.fullname,
      "and ",
      currentUser.username,
      "Id :",
      currentUser.id,
      "user Type",
      currentUser?.userType?.name,
      "country ID :",
      currentUser?.country?.id
    );
  
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
  }
  

  async getAllCAList(
    
    options: IPaginationOptions,
    filterText: string,
    projectStatusId: number,
    projectApprovalStatusId: number,
   
    countryId: number,
    sectorId: number,
  ): Promise<Pagination<ClimateAction>> {
    console.log("filterText",filterText)
    let filter: string = '';
    let user = this.userService.currentUser();
    
    const currentUser = await user;
    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(dr.policyName LIKE :filterText  OR dr.typeofAction LIKE :filterText OR pst.name LIKE :filterText  OR pas.description LIKE :filterText )';
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
        'dr.country',
         Country,
        'cntry',
        'cntry.id = dr.countryId',
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

      const isUserExternal = currentUser?.userType?.name === 'External';
      const isUserVerifier = currentUser?.userType?.name === 'Verifier';
      //users filter by country id
      const isUsersFilterByInstitute=currentUser?.userType?.name === 'Institution Admin'||currentUser?.userType?.name === 'Data Entry Operator'
      console.log("user type", currentUser?.userType?.name)
      const allowedUserTypes = [
        'Country Admin',
        'Sector Admin',
        'Technical Team',
        'MRV Admin',
        'Data Collection Team',
        'QC Team',
        'MASTER_ADMIN'
      ];
      const allowedUserTypesForAcceptedInterverntions = [
        'Sector Admin',
        'Technical Team',
        'MRV Admin',
      ];
      if (isUserExternal || isUserVerifier){
        data.andWhere('user.id = :userId', { userId: currentUser.id })
      }
      else if  (allowedUserTypes.includes(currentUser?.userType?.name)){
        console.log("............")
        data.andWhere('cntry.id = :countryId', { countryId: currentUser?.country?.id })
      }
      else if (isUsersFilterByInstitute){
        console.log("+++++++++++",isUsersFilterByInstitute)
        data.andWhere('ins.id = :insId', { insId: currentUser?.institution?.id  })
      }
      // accpeted policies showing
      if  (!allowedUserTypesForAcceptedInterverntions.includes(currentUser?.userType?.name)){
        console.log("*********")
        data.andWhere('pas.id != :projectApprovalStatusId', { projectApprovalStatusId: 1 })
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
  
  async findPolicyBarrierData(policyID: number){
    return this.PolicyBarriersRepo.find({
      relations: ['barriers','characteristics'],
      where: { climateAction: { id: policyID } },
    });
  }
  


}
