import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
import { Methodology } from 'src/methodology-assessment/entities/methodology.entity';
import { UsersService } from 'src/users/users.service';
import { MethodologyAssessmentParameters } from 'src/methodology-assessment/entities/methodology-assessment-parameters.entity';
import { Institution } from 'src/institution/entity/institution.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { DataVerifierDto } from './dto/dataVerifier.dto';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class AssessmentService extends TypeOrmCrudService<Assessment> {

  constructor(
    @InjectRepository(Assessment) repo,
    private readonly userService: UsersService,
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
        `proj.id = asse.climateAction_id`,
      )
      .leftJoinAndMapOne(
        'asse.methodology',
        Methodology,
        'meth',
        `meth.id = asse.methodology_id`,
      )
      .where({ id: id })
      .getOne();
    console.log("qqqqqqq", data)
    return data;
  }

  async update(id: number, updateAssessmentDto: UpdateAssessmentDto) {
    let ass =await this.repo.findOne({ where: { id: id }});
    ass.qaDeadline = updateAssessmentDto.deadline
    ass.editedOn = updateAssessmentDto.editedOn
    ass.verificationStatus = updateAssessmentDto.verificationStatus
    await this.repo.save(ass);
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
      .where(filter, {
        filterText: `%${filterText}%`,
        isProposal,
        projectStatusId,
        projectApprovalStatusId,
        sectorIdFromTocken,
      })

    let resualt = await paginate(data, options);
    if (resualt) {
      console.log('results for manage..', resualt);
      return resualt;
    }
  }


  async getAssessmentForApproveData(
    assessmentId: number,
    assementYear: string,
    userName: string,
  ): Promise<any> {
    let userItem = await this.userService.findByUserName(userName);
    console.log('userItem', userItem);

    var data = this.repo
      .createQueryBuilder('as')
      .leftJoinAndMapMany('as.parameters', MethodologyAssessmentParameters, 'pa', 'as.id = pa.assessment_id ',)
      .leftJoinAndMapOne('pa.institution', Institution, 'in', 'in.id = pa.institution_id',)
      .leftJoinAndMapOne('pa.parameterRequest', ParameterRequest, 'par', 'par.ParameterId = pa.id',)
      .leftJoinAndMapOne('as.project', ClimateAction, 'pr', 'pr.id = as.climateAction_id')
      .where(
        `as.id = ${assessmentId} AND par.dataRequestStatus in (9,-9,11)`,
      );
    let result = await data.getOne();
    console.log('qqqqqqqqqq111qqqqqq', result)
    return result;
  }


  async acceptQC(updateDataRequestDto: DataVerifierDto): Promise<boolean> {
    let insSec: any;
    let inscon: any;

    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      let dataRequestItem = await this.repo.findOne({ where: { id: id }});
      console.log('dataRequestItem', dataRequestItem);
      let originalStatus = dataRequestItem.qaStatus;
      dataRequestItem.qaStatus = updateDataRequestDto.status;


      // inscon = dataRequestItem.assessment.project.country;
      // console.log("inscon", dataRequestItem.assessment.project.country)
      // insSec = dataRequestItem.assessment.project.sector;
      // console.log("insSec", insSec)

      this.repo.save(dataRequestItem).then((res) => {
        console.log('res', res);
      });
    }
  //   let user:User[];
  //  let ins = await this.institutionRepo.findOne({ where: { country: inscon, sector: insSec, type: 2 } });
  //  user= await this.userService.find({where:{country:inscon,userType:7,institution:ins}})
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

    ///////////////////////////////////////////////////////////

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
    // console.log('data1SQL2', data2.getSql());
    let totalRecordsApprovedStatus: any[] = await data2.execute();
    if (totalRecordsApprovedStatus.length == totalRecordsAllStatus.length) {
      return true;
    }

    return false;
  }
  
}
