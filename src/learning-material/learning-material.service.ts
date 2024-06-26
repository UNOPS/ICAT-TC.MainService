import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { UserType } from 'src/users/entity/user.type.entity';
import { LearningMaterialUserType } from './entity/learning-material-usertype.entity';
import { LearningMaterial } from './entity/learning-material.entity';
@Injectable()
export class LearningMaterialService extends TypeOrmCrudService<LearningMaterial> {

  constructor(@InjectRepository(LearningMaterial) repo) {
    super(repo);
  }



  async softDelete(id: number) {
    this.repo.softDelete({ id });
    return;
  }

  async getlearningmaterialdetails(
    options: IPaginationOptions,
    filterText: string,
    typeId: number,
    sectorId: number,
    sortOrder: number,
    sortType: number,
  ): Promise<Pagination<LearningMaterial>> {
    let filter: string = '';

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(lm.documentType LIKE :filterText OR lm.documentName LIKE :filterText OR lm.editedOn LIKE :filterText)';
    }

    if (typeId != 0) {
      if (filter) {
        filter = `${filter}  and ut.id = :typeId`;
      } else {
        filter = `ut.id = :typeId`;
      }
    }

    if (sectorId != 0) {
      if (filter) {
        filter = `${filter}  and st.id = :sectorId`;
      } else {
        filter = `st.id = :sectorId`;
      }
    }


    if (sortOrder == 0) {
      if (sortType == 0) {
        var val = 'lm.editedOn';
      }
      else {
        var val = 'lm.documentName';
      }
      var data = this.repo
        .createQueryBuilder('lm')
        .leftJoinAndMapMany('lm.learningMaterialUserType', LearningMaterialUserType, 'lmu', 'lmu.learningMaterialId = lm.Id')
        .leftJoinAndMapMany('lm.userType', UserType, 'ut', 'lmu.userTypeId = ut.Id')
        .where(filter, {
          filterText: `%${filterText}%`,
          typeId,
          sectorId,
        })
        .orderBy(val, 'DESC');
    }
    else {
      if (sortType == 0) {
        var val = 'lm.editedOn';
      }
      else {
        var val = 'lm.documentName';
      }
      var data = this.repo
        .createQueryBuilder('lm')
        .leftJoinAndMapMany('lm.learningMaterialUserType', LearningMaterialUserType, 'lmu', 'lmu.learningMaterialId = lm.Id')
        .leftJoinAndMapMany('lm.userType', UserType, 'ut', 'lmu.userTypeId = ut.Id')
        .where(filter, {
          filterText: `%${filterText}%`,
          typeId,
          sectorId,
        })
        .orderBy(val, 'ASC');

    }

    let result = await paginate(data, options);
    if (result) {
      return result;
    }
  }


}
