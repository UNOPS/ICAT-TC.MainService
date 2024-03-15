import { Injectable, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { UsersService } from 'src/users/users.service';
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
  ): Promise<Pagination<Institution>> {
    let arr = sectorIdFromTocken.toString();
    arr = '(' + arr + ")";
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


    if (userTypeFromTocken != "Master Admin" && userTypeFromTocken != "Country Admin" && sectorIdFromTocken) {
      let ins = await this.repo.findOne({ where: { id: institutionTypeId } })
      if (filter) {
        filter = `${filter}  and ins.sectorId =` + ins.sectorId;
      } else {
        filter = `ins.sectorId = ` + ins.sectorId;
      }
    }

    if (userTypeFromTocken == "Technical Team") {

      if (filter) {
        filter = `${filter}  and ins.typeId = 3`;
      } else {
        filter = `ins.typeId = 3)`;
      }
    }

    if (userTypeFromTocken == "Master Admin") {
      if (filter) {
        filter = `${filter}  and ins.typeId in (1,2,3,4,5,6)`;
      } else {
        filter = `ins.typeId in (1,2,3,4,5,6)`;
      }
    }

    else if (userTypeFromTocken === "Data Collection Team") {
      if (filter) {
        filter = `${filter} and user.userTypeId = 9 or user.userTypeId = 8`
      } else {
        filter = `user.userTypeId = 9 or user.userTypeId = 8`
      }
    }

    let data = this.repo.createQueryBuilder('ins')
      .innerJoinAndMapOne('ins.category', InstitutionCategory, 'cate', 'cate.id = ins.categoryId',)
      .innerJoinAndMapOne('ins.type', InstitutionType, 'type', 'type.id = ins.typeId',)
      .leftJoinAndMapMany('ins.user', User, 'user', 'ins.id=user.institutionId',)
      .where(filter, {
        filterText: `%${filterText}%`,
        countryIdFromTocken,
        sectorIdFromTocken,
      },)
      .orderBy('ins.createdOn', 'DESC')
      .groupBy('ins.id');


    let result = await paginate(data, options);
    if (result) {
      return result;
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


    let data = this.repo
      .createQueryBuilder('ins')
      .innerJoinAndMapOne(
        'ins.country',
        Country,
        'cou',
        `ins.countryId = cou.id and cou.id = ${countryIdFromTocken} and ins.name= '` + filterText + `'`,
      )

    let num = await data.getMany();
    return num;
  }


  async getInstituion(
    options: IPaginationOptions,
    filterText: number,
    countryId: number) {

    const policies = await this.repo.createQueryBuilder('institution')
      .select(['institution.id', 'institution.name'])
      .where('typeId=' + filterText + ' AND countryId=' + countryId)
      .getMany();
    return policies
  }
  async getInstituionById(
    Id: number) {

    return this.repo.findOne({ relations: ['type', 'category'], where: { id: Id } })
  }

  async getInstitutionForUsers(

    inside: number,
    userType: number
  ): Promise<any> {
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



    let result = await data.getCount();
    if (result) {

      return result;
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

    let result = await data.getMany();

    if (result) {
      return result;
    }
  }

  async getInstitutionforApproveData(
    countryIdFromTocken: number,
    sectorIdFromTocken: number
  ): Promise<Institution[]> {

    let arr = sectorIdFromTocken.toString();
    arr = '(' + arr + ")";

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

    let result = await data.getMany();

    if (result) {
      return result;
    }
  }



  async getInstitutionForManageUsers(

    options: IPaginationOptions,
    countryIdFromTocken: number,
    sectorIdFromTocken: any,
    institutionIdFromTocken: number,
    role: string,
    secId: number,
    username: string,
    id: number
  ) {
    let filter: string = 'ins.status=0';

    if (id != 0) {
      let user1 = await this.userRepository.findOne({ where: { id: id } });
      if (role == "Country Admin" && user1.userType.id != 1) {
        let user = await this.userRepository.findOne({ where: { username: username } });
        if (filter) {
          filter = `${filter}  and ins.id not in (${user.institution.id})`;
        } else {
          filter = `ins.id not in (${user.institution.id})`;
        }
      }
    }
    if (id == 0) {
      if (role == "Country Admin") {
        let user = await this.userRepository.findOne({ where: { username: username } });
        if (filter) {
          filter = `${filter}  and ins.id not in (${user.institution.id})`;
        } else {
          filter = `ins.id not in (${user.institution.id})`;
        }
      }
    }


    if (countryIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and ins.countryId = :countryIdFromTocken`;
      } else {
        filter = `ins.countryId = :countryIdFromTocken`;
      }
    }
    else if (role == "Sector Admin") {
      if (filter) {
        filter = `${filter}  and ins.typeId not in (1) and ins.sectorId=` + secId;
      } else {
        filter = `ins.typeId not in (1) and ins.sectorId=` + secId;
      }
    }
    else if (role == "MRV Admin") {
      if (filter) {
        filter = `${filter}  and ins.typeId not in (1,2) and ins.sectorId=` + secId;
      } else {
        filter = `ins.typeId not in (1,2) and ins.sectorId=` + secId;
      }
    }
    else if (role == "Technical Team" || role == "Data Collection Team" || role == "QC Team") {
      if (filter) {
        filter = `${filter}  and ins.typeId = 3 and ins.sectorId=` + secId;
      } else {
        filter = `ins.typeId = 3 and ins.sectorId=` + secId;
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



    let result = await paginate(data, options);
    if (result) {
      return result;
    }

  }

  async getAllInstitutions(): Promise<Institution[]> {
    let result = await this.repo.find();
    if (result) {
      return result;
    }

  }
  async creteNew(ins: Institution): Promise<Institution> {
    return this.repo.save(ins)
  }

  async update(ins: Institution) {
    let instituon = await this.repo.findOne({ where: { id: ins.id } })

    instituon.name = ins.name;
    instituon.email = ins.email;
    instituon.telephoneNumber = ins.telephoneNumber;
    instituon.description = ins.description;
    instituon.address = ins.address;
    instituon.category = ins.category;
    instituon.status = ins.status;
    return this.repo.save(instituon)
  }

  async create(ins: Institution) {
    let institution = new Institution();
    institution.name = ins.name;
    institution.email = ins.email;
    institution.telephoneNumber = ins.telephoneNumber;
    institution.description = ins.description;
    institution.address = ins.address;
    institution.category = ins.category;
    institution.status = ins.status;
    institution.type = ins.type;
    institution.country = ins.country;
    institution.sector = ins.sector;
    institution.sortOrder = 1;
    return await this.repo.save(institution)
  }

}
