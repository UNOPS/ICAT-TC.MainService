import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from 'src/users/entity/user.entity';
import { UserType } from 'src/users/entity/user.type.entity';
import { Institution } from '../entity/institution.entity';
import { InstitutionType } from '../entity/institution.type.entity';

@Injectable()
export class InstitutionTypeService extends TypeOrmCrudService<InstitutionType>{
  constructor(@InjectRepository(InstitutionType) repo,
  ) {
    super(repo);
  }

  async getInstitutionTypesByUser(
    userId: number,
  ): Promise<any> {
    let filter: string = '';

    if (userId != 1) {
      if (filter) {
        filter = `${filter}  and user.userTypeId = :userId`;
      } else {
        filter = `user.userTypeId = :userId`;
      }
    }

    let data = this.repo
      .createQueryBuilder('itype')
      .leftJoinAndMapOne('itype.type', Institution, 'ins', 'itype.id = ins.typeId')
      .leftJoinAndMapOne('ins.user', User, 'user', 'ins.id = user.institutionId')
      .leftJoinAndMapOne('user.userType', UserType, 'userType', 'userType.id = user.userTypeId')


      .where(filter, {
        userId,
      })
      .orderBy('ins.createdOn', 'DESC');

    return data;

  }

  async getInstitution(id: number) {

    if (id != 0) {
      let list = new Array
      await list.push(await this.repo.findOne({  where: { id: id } }))
      return list
    }
    else {
      return this.repo.find();
    }
  }
}



