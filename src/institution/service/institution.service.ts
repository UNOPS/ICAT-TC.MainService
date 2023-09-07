import { count, log } from 'console';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { UserType } from 'src/users/entity/user.type.entity';
import { Country } from 'src/country/entity/country.entity';
import { Institution } from '../entity/institution.entity';
import { User } from 'src/users/entity/user.entity';
import { InstitutionCategory } from '../entity/institution.category.entity';
import { InstitutionType } from '../entity/institution.type.entity';

@Injectable()
export class InstitutionService extends TypeOrmCrudService<Institution> {

  constructor(
    @InjectRepository(Institution) repo,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(User)
    private readonly userService: UsersService,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {
    super(repo);
  }

  async softDelete(id: number) {
    this.repo.softDelete({ id });
    return;
  }

  async getInstitutionDetails(
    options: IPaginationOptions,
    filterText: string,
    userId: number,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
    institutionTypeId: number,
    userTypeFromTocken: string
    // status: number,
  ): Promise<Pagination<Institution>> {
    let arr =  sectorIdFromTocken.toString() ;
    arr = '(' + arr+ ")";
    let filter: string = '';

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(ins.name LIKE :filterText OR ins.address LIKE :filterText OR cate.name LIKE :filterText OR type.name LIKE :filterText OR user.firstName LIKE :filterText OR user.lastName LIKE :filterText)';
     }
    if (filterText == 'Activate' || filterText == 'activate') {
      filter = `ins.status = 0`;
    }
    if (filterText == 'Deactivate' || filterText == 'deactivate') {
      filter = `ins.status = -10`;
    }


    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and ins.countryId = :countryIdFromTocken`;
      } else {
        filter = `ins.countryId = :countryIdFromTocken`;
      }
    }


    if (userTypeFromTocken != "Master_Admin" && userTypeFromTocken != "Country Admin" && sectorIdFromTocken) {
      let ins= await this.repo.findOne({where:{id:institutionTypeId}})
      if (filter) {
        filter = `${filter}  and ins.sectorId =` + ins.sectorId;
      } else {
        filter = `ins.sectorId = ` + ins.sectorId;
      }
    }

    if (userTypeFromTocken == "Technical Team") {
      console.log('Technical')

      if (filter) {
        filter = `${filter}  and ins.typeId = 3`;
      } else {
        filter = `ins.typeId = 3)`;
      }
    }

    if (userTypeFromTocken == "MASTER_ADMIN") {
      if (filter) {
        filter = `${filter}  and ins.typeId in (1,2,3,4,5,6)`;
      } else {
        filter = `ins.typeId in (1,2,3,4,5,6)`;
      }
    }

    else if (userTypeFromTocken === "Data Collection Team"){
      console.log("Data Collection Team")
      if (filter) {
        filter = `${filter} and user.userTypeId = 9 or user.userTypeId = 8`
      } else {
        filter = `user.userTypeId = 9 or user.userTypeId = 8`
      }
    }

    console.log("filter",filter)
    let data = this.repo.createQueryBuilder('ins')
      .innerJoinAndMapOne('ins.category',InstitutionCategory,'cate','cate.id = ins.categoryId',)
      .innerJoinAndMapOne('ins.type',InstitutionType,'type','type.id = ins.typeId',)
      .leftJoinAndMapMany('ins.user',User,'user','ins.id=user.institutionId',)
      .where(filter, {
        filterText: `%${filterText}%`,
        countryIdFromTocken,
        sectorIdFromTocken,
      },)      
      .orderBy('ins.createdOn', 'DESC')
      .groupBy('ins.id');

    console.log('query',data.getQuery());

    let resualt = await paginate(data, options);
    if (resualt) {
      console.log('resula',resualt)
      return resualt;
    }
  }

  async getInsDetails(
    filterText: string,
    countryIdFromTocken: number,
  ) {
    let filter: string = '';

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(ins.name LIKE :filterText )';
    }
    let cou = await this.countryRepository.findOne({where:{ id: countryIdFromTocken} });
    let num = await this.repo.find({ where:{name: filterText} })
    return num;
  }


  async getInstituion(
    options: IPaginationOptions,
    filterText: number,
    countryId:number){
  
      const policies = await this.repo.createQueryBuilder('institution')
        .select(['institution.id', 'institution.name'])
        .where('typeId=' + filterText+' AND countryId=' + countryId)
        .getMany();
    console.log("22222222222222222",policies)
     return policies
  }

  async getInstitutionForUsers(

    inside: number,
    userType: number
  ): Promise<any> {
    let filter: string = '';


    let data = this.repo
      .createQueryBuilder('ins')
      .select(['ins.id', 'user.id'])
      .leftJoinAndMapMany(
        'ins.user',
        User,
        'user',
        'ins.id = user.institutionId ',
      )
      .where('ins.id = :inside and user.userTypeId = :userType', {
        inside, userType
      })



    let resualt = await data.getCount();
    // console.log('resula====', resualt);
    if (resualt) {

      return resualt;
    }
  }

  async getInstitutionforAssesment(
    countryIdFromTocken: number,
  ): Promise<Institution[]> {


    let data = this.repo
      .createQueryBuilder('ins')
      .leftJoinAndMapOne(
        'ins.type',
        InstitutionType,
        'type',
        'type.id = ins.typeId',
      )
      .innerJoinAndMapOne(
        'ins.country',
        Country,
        'cou',
        `ins.countryId = cou.id and cou.id = ${countryIdFromTocken}`,
      )
      .where('type.id = 3')
      .orderBy('ins.name', 'ASC');
    // .addOrderBy('ins.createdOn','DESC')
    // console.log('data........',data)
    // console.log('data////////',data)
    //     let user: User = new User();

    // console.log('query',data.getQuery());

    let resualt = await data.getMany();

    if (resualt) {
      // console.log('resula',resualt)
      return resualt;
    }
  }

  async getInstitutionforApproveData(
    countryIdFromTocken: number,
    sectorIdFromTocken: number
  ): Promise<Institution[]> {

    let arr =  sectorIdFromTocken.toString() ;
    arr = '(' + arr+ ")";

    let data = this.repo
      .createQueryBuilder('ins')
      .leftJoinAndMapOne(
        'ins.type',
        InstitutionType,
        'type',
        'type.id = ins.typeId',
      )
      .innerJoinAndMapOne(
        'ins.country',
        Country,
        'cou',
        `ins.countryId = cou.id and cou.id = ${countryIdFromTocken}`,
      )
      .where('type.id = 3' + (sectorIdFromTocken != 0 ? ` and ins.sectorId in ${arr}` : ''))
      .orderBy('ins.name', 'ASC');

    let resualt = await data.getMany();

    if (resualt) {
      return resualt;
    }
  }



  async getInstitutionForManageUsers(

    options: IPaginationOptions,
    countryIdFromTocken: number,
    sectorIdFromTocken: any,
    institutionIdFromTocken: number,
    role: string,
    secId:number
  ) {
    let filter: string = '';
    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and ins.countryId = :countryIdFromTocken`;
      } else {
        filter = `ins.countryId = :countryIdFromTocken`;
      }
    }
    else if (role == "Sector Admin") {
      if (filter) {
        filter = `${filter}  and ins.typeId not in (1) and ins.sectorId=`+secId;
      } else {
        filter = `ins.typeId not in (1) and ins.sectorId=`+secId;
      }
    }
    else if (role == "MRV Admin") {
      if (filter) {
        filter = `${filter}  and ins.typeId not in (1,2) and ins.sectorId=`+secId;
      } else {
        filter = `ins.typeId not in (1,2) and ins.sectorId=`+secId;
      }
    }
    else if (role == "Technical Team" || role == "Data Collection Team" || role == "QC Team") {
      if (filter) {
        filter = `${filter}  and ins.typeId = 3 and ins.sectorId=`+secId;
      } else {
        filter = `ins.typeId = 3 and ins.sectorId=`+secId;
      }
    }

    else {
    }

    let data = this.repo
      .createQueryBuilder('ins')
      .leftJoinAndMapOne(
        'ins.category',
        InstitutionCategory,
        'cate',
        'cate.id = ins.categoryId',
      )
      .leftJoinAndMapOne(
        'ins.type',
        InstitutionType,
        'type',
        'type.id = ins.typeId',
      )


      .where(filter, {
        countryIdFromTocken,
        sectorIdFromTocken,
        institutionIdFromTocken

      })
      .orderBy('ins.status', 'ASC');



    let resualt = await paginate(data, options);
    if (resualt) {
      return resualt;
    }

  }

  async getAllInstitutions():Promise<Institution[]>{
    let result = await this.repo.find();
    if (result){
      return result;
    }
    
  }
  async creteNew(ins:Institution):Promise<Institution> {
    return this.repo.save(ins)
  }



}
