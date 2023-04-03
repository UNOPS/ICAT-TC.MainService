import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { Assessment } from './entities/assessment.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { ClimateAction } from 'src/climate-action/entity/climate-action.entity';

@Injectable()
export class AssessmentService extends TypeOrmCrudService<Assessment> {

  constructor(
    @InjectRepository(Assessment) repo,
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
    return this.repo.findOne({where:{id:id}});
  }

  update(id: number, updateAssessmentDto: UpdateAssessmentDto) {
    return `This action updates a #${id} assessment`;
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
    sectorIdFromTocken:number,
  
  ): Promise<any> {

    let filter: string = '';

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
      '(proj.policyName LIKE :filterText OR asse.assessmentType LIKE :filterText)';
    }
    // if (isProposal != undefined) {
    //   if (filter) {
    //     filter = `${filter}  and asse.isProposal = :isProposal`;
    //   } else {
    //     filter = ` asse.isProposal = :isProposal`;
    //   }
    // }
    if (projectStatusId != 0) {
      if (filter) {
        filter = `${filter}  and proj.projectStatusId = :projectStatusId`;
      } else {
        filter = ` proj.projectStatusId = :projectStatusId`;
      }
    }
    if (projectApprovalStatusId != 0) {
      console.log("1111111111111111111111")
      if (filter) {
        filter = `${filter}  and proj.projectApprovalStatusId = :projectApprovalStatusId`;
      } else {
        filter = `proj.projectApprovalStatusId = :projectApprovalStatusId`;
      }
    }
    if (sectorIdFromTocken != 0) {
      if (filter) {
        filter = `${filter}  and proj.sectorId = :sectorIdFromTocken`;
      } else {
        filter = `proj.sectorId = :sectorIdFromTocken`;
      }
    }

    
  let data = this.repo
  .createQueryBuilder('asse')
  
  .leftJoinAndMapOne(
    'asse.climateAction',
    ClimateAction,
    'proj',
    `proj.id = asse.climateAction_id and  proj.countryId = ${countryIdFromTocken}`,
  )
  // .select([
  //   'asse.id',
  //   'asse.assessmentType',
  //   'proj.policyName',
  // ])
  .where(filter, {
    filterText: `%${filterText}%`,
    isProposal,
    projectStatusId,
    projectApprovalStatusId,
   sectorIdFromTocken,
  })
  // .orderBy('asse.createdOn', 'DESC');

  console.log(
    '=====================================================================',projectApprovalStatusId , sectorIdFromTocken
  );
  let resualt = await paginate(data, options);
  if (resualt) {
    console.log('results for manage..', resualt);
    return resualt;
  }
  }
}
