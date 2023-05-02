import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { VerificationDetail } from './entity/verification-detail.entity';
import { ParameterRequest } from 'src/data-request/entity/data-request.entity';
import { Institution } from 'src/institution/entity/institution.entity';
import { User } from 'src/users/entity/user.entity';
import { AssessmentService } from 'src/assessment/assessment.service';
import { ParameterHistoryService } from 'src/parameter-history/parameter-history.service';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { ClimateAction } from 'src/climate-action/entity/climate-action.entity';
import { MethodologyAssessmentParameters } from 'src/methodology-assessment/entities/methodology-assessment-parameters.entity';
import { DataRequestStatus } from 'src/data-request/entity/data-request-status.entity';
import { ParameterHistoryAction } from 'src/parameter-history/entity/parameter-history-action-history.entity';

@Injectable()
export class VerificationService extends TypeOrmCrudService<ParameterRequest> {
  constructor(
    @InjectRepository(ParameterRequest) repo,
    @InjectRepository(VerificationDetail)
    private readonly verificationDetailRepo: Repository<VerificationDetail>,
    @InjectRepository(Institution)
    public institutionRepo: Repository<Institution>,
    @InjectRepository(User)
    public userRepo: Repository<User>,
    @InjectRepository(ParameterRequest)
    private readonly ParameterRequestRepo: Repository<ParameterRequest>,
    @InjectRepository(Assessment) private assessmentRepo: Repository<Assessment>, 
    public parameterHistoryService: ParameterHistoryService,
    private readonly emaiService: EmailNotificationService,
  ) {
    super(repo);
  }

  async GetVRParameters( //for sector admin
    options: IPaginationOptions,
    filterText: string,
    VRstatusId: number,
    countryIdFromTocken: number,
  ): Promise<Pagination<Assessment>> {
    let filter: string = `assessment.verificationStatus is not null`;

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(p.climateActionName LIKE :filterText  OR assessment.assessmentType LIKE :filterText OR assessment.year like :filterText OR assessment.editedOn  like :filterText OR assessment.verificationDeadline  like :filterText OR assessment.verificationStatus  like :filterText)';
    }

    if (VRstatusId != 0) {
      filter = `${filter}  and assessment.verificationStatus = :VRstatusId`;
    }
    let data = this.assessmentRepo.createQueryBuilder('assessment')
      .innerJoinAndMapOne(
        'assessment.climateAction',
        ClimateAction,
        'p',
        `assessment.climateAction_id = p.id and p.countryId = ${countryIdFromTocken}`)
      .where(filter, {
        filterText: `%${filterText}%`,
        VRstatusId,
      })
      // .groupBy('ae.Assessmentid')
      // .groupBy('ae.AssessmentYear')
      .orderBy('assessment.qaDeadline', 'DESC');
    // console.log(
    //   '=====================================================================',
    // );
    console.log("PPPPPPPP",data.getQuery());

    let resualt = await paginate(data, options);

    if (resualt) {
      console.log("result is...",resualt)
      return resualt;
    }
  }

  async GetVerifierParameters(
    options: IPaginationOptions,
    filterText: string,
    VRstatusId: number,
    countryIdFromTocken: number,
    userNameFromTocken: any,
  ): Promise<Pagination<any>> {
    let filter: string = `assessment.verificationStatus is not null`;
    let user = await this.userRepo.findOne({ where: { username: userNameFromTocken } })

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(p.climateActionName LIKE :filterText  OR assessment.assessmentType LIKE :filterText OR ae.year like :filterText OR ae.editedOn  like :filterText OR ae.verificationDeadline  like :filterText OR ae.verificationStatus  like :filterText)';
    }

    if (VRstatusId != 0) {
      filter = `${filter}  and assessment.verificationStatus = :VRstatusId`;
    }

    let data = this.assessmentRepo.createQueryBuilder('assessment')
      .innerJoinAndMapOne(
        'assessment.climateAction',
        ClimateAction,
        'p',
        `assessment.climateAction_id = p.id and p.countryId = ${countryIdFromTocken}`)
      .where(filter + " AND (assessment.verificationStatus !=7 AND assessment.verificationStatus !=6 AND assessment.verificationUser =" + user.id + " )", {
        filterText: `%${filterText}%`,
        VRstatusId,
      })
    let resualt = await paginate(data, options);

    if (resualt) {
      return resualt;
    }
  }

  async saveVerificationDetail(verificationDetail: VerificationDetail[]) {
    try {
      this.verificationDetailRepo.save(verificationDetail);

      let ass = verificationDetail[0].assessment.id;
      console.log("asseYa", verificationDetail)
      let assesment = await this.assessmentRepo.findOne({
        where: { id: ass } , 
        relations: ['climateAction', 'climateAction.country', 'climateAction.sector']})
      // let assesment = await this.assesmentservice.findOne({ where: { id: verificationDetail[0].assessmentId }})

      let user: User[];
      let inscon = assesment.climateAction.country;
      let insSec = assesment.climateAction.sector
      // let ins = await this.institutionRepo.findOne({ where: { country: inscon, sector: insSec, type: 2 } });
      let ins = await this.institutionRepo.findOne({ where: { country: { id: inscon.id }, sector: { id: insSec.id }, type: { id: 2 } } })
      console.log(ins)
      user = await this.userRepo.find({ where: { country: { id: inscon.id }, userType: { id: 5 }, institution: { id: ins.id } } })

      user.forEach((ab) => {
        let template =
          'Dear ' +
          ab.username + ' ' +
          '<br/>Data request with following information has shared with you.' +
          ' <br/> Accepted Verifir value' +
          // '<br/> parameter name -: ' + dataRequestItem.parameter.name +
          // '<br/> value -:' + dataRequestItem.parameter.value +
          '<br> project -: ' + assesment.climateAction.policyName;

        this.emaiService.sendMail(
          ab.email,
          'Accepted parameter',
          '',
          template,
        );
      })

      verificationDetail.map(async (a) => {
        if (a.parameter) {
          let description = '';
          let comment = '';
          if (a.verificationStage == 1) {
            if (a.isAccepted) {
              description = 'Verifier Accepted.';
            }
            if (a.explanation) {
              description = 'Verifier raised concern.';
              comment = a.rootCause;
            }
          }

          let data = this.ParameterRequestRepo
            .createQueryBuilder('paraReq')
            .innerJoinAndMapOne(
              'paraReq.parameter',
              MethodologyAssessmentParameters,
              'para',
              `paraReq.ParameterId = para.id and para.id = ${a.parameter.id}`,
            )

          let result1 = await data.getOne();
          console.log("my parameter111..", result1)

          this.parameterHistoryService.SaveParameterHistory(
            result1.id,
            ParameterHistoryAction.Verifier,
            description,
            comment,
            a.verificationStatus.toString(),
            '',
          );

          if (a.id == undefined && a.isDataRequested == true) {
            let dataRequest = await this.ParameterRequestRepo.findOne({
              where: { parameter: {id: a.parameter.id} },
            });
            console.log(dataRequest);
            dataRequest.dataRequestStatus =
              DataRequestStatus.Verifier_Data_Request;
            await this.ParameterRequestRepo.save(dataRequest);
          }
        }
      });


    } catch (error) {
      throw error;
    }
  }

  async getVerificationDetails(
    assessmentId: number,
  ): Promise<VerificationDetail[]> {
    // let filter: string = `dataRequestStatus in (${DataRequestStatus.QA_Assign.valueOf()},${DataRequestStatus.QAPass.valueOf()},${DataRequestStatus.QAFail.valueOf()})`;

    let data = this.verificationDetailRepo
      .createQueryBuilder('vd')
      .leftJoinAndMapOne(
        'vd.parameter',
        MethodologyAssessmentParameters,
        'p',
        'vd.parameterId = p.id',
      )
      .innerJoinAndMapOne(
        'vd.assessment',
        Assessment,
        'assessment',
        'vd.assessmentId = assessment.id'
      )
      .where('assessment.id = :assessmentId', { assessmentId });

    let resualt = data.getMany();

    if (resualt) {
      return resualt;
    }
  }
}


