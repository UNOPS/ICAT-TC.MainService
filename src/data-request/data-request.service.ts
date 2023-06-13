import { User } from 'src/users/entity/user.entity';
import { DataRequestStatus } from './entity/data-request-status.entity';
import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ParameterRequest } from './entity/data-request.entity';

import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

import { UpdateDeadlineDto } from './dto/dataRequest.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { EmailNotificationService } from 'src/notifications/email.notification.service';
import { Country } from 'src/country/entity/country.entity';
import { MethodologyAssessmentParameters } from 'src/methodology-assessment/entities/methodology-assessment-parameters.entity';
import { Institution } from 'src/institution/entity/institution.entity';
import { ClimateAction as Project } from 'src/climate-action/entity/climate-action.entity';
import { ParameterHistoryService } from 'src/parameter-history/parameter-history.service';
import { DefaultValue } from 'src/default-value/entity/defaultValue.entity';
import { Assessment } from 'src/assessment/entities/assessment.entity';
import { ParameterHistoryAction } from 'src/parameter-history/entity/parameter-history-action-history.entity';
import { MethodologyAssessmentParameters as Parameter} from 'src/methodology-assessment/entities/methodology-assessment-parameters.entity';
import { Characteristics } from 'src/methodology-assessment/entities/characteristics.entity';
import { Category } from 'src/methodology-assessment/entities/category.entity';
import { Tool } from './enum/tool.enum';
import { CMAssessmentAnswer } from 'src/carbon-market/entity/cm-assessment-answer.entity';

@Injectable()
export class ParameterRequestService extends TypeOrmCrudService<ParameterRequest> {
  constructor(
    @InjectRepository(ParameterRequest) repo,
    private readonly userService: UsersService,
    private readonly parameterHistoryService: ParameterHistoryService,
    private readonly emaiService: EmailNotificationService,
    @InjectRepository(MethodologyAssessmentParameters)
    public paramterRepo: Repository<MethodologyAssessmentParameters>,
    @InjectRepository(Institution)
    public institutionRepo: Repository<Institution>,
    @InjectRepository(User)
    public userRepo: Repository<User>,
    @InjectRepository(DefaultValue)
    public defaultValRepo: Repository<DefaultValue>,
    @InjectRepository(Project)
    public ProjectRepo: Repository<Project>,
  ) {
    super(repo);
  }

  async getDateRequestToManageDataStatus(
    assesmentId: number,
    assessmentYear: number,
  ): Promise<any> {
    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapMany(
        'dr.parameter',
        Parameter,
        'para',
        'para.id = dr.parameterId',
      )
      .select(['dr.dataRequestStatus', 'para.id'])
      .where(
        `para.assessment_id = ${assesmentId}`,
      );
      // .where(
      //   `para.assessment_id = ${assesmentId} 
      //   AND ((para.isEnabledAlternative = true AND para.isAlternative = true) OR (para.isEnabledAlternative = false AND para.isAlternative = false ))
      //    AND COALESCE(para.AssessmentYear ,para.projectionBaseYear ) = ${assessmentYear}`,
      // );

    return await data.execute();
  }
  

  async getNewDataRequest(
    options: IPaginationOptions,
    filterText: string,
    climateActionId: number,
    year: string,
    dataProvider: number,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
  ): Promise<Pagination<any>> {
    let whereCond = (
      (climateActionId != 0
        ? `p.id=${climateActionId} AND  p.countryId = ${countryIdFromTocken} AND `
        : '') +
      (year != '' ? `ay.assessmentYear='${year}' AND ` : '') +
      (dataProvider != 0 ? `para.institution_id=${dataProvider} AND ` : '') +
      // '((para.isEnabledAlternative = true AND para.isAlternative = true) OR (para.isEnabledAlternative = false AND para.isAlternative = false) ) AND ' +
      `dr.dataRequestStatus in (-1,1,30,-6) AND ` +
      (filterText != ''
        ? `(p.climateActionName LIKE '%${filterText}%' OR para.name LIKE '%${filterText}%' OR i.name LIKE '%${filterText}%'
           )`
        : '')
    ).replace(/AND $/, '');

    console.log(whereCond);

    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.parameter',
        Parameter,
        'para',
        'para.id = dr.parameterId',
      )
      .leftJoinAndMapOne(
        'para.category',
        Category,
        'cat',
        'cat.id = para.category_id',
      )
      .leftJoinAndMapOne(
        'para.characteristics',
        Characteristics,
        'chara',
        'chara.id = para.characteristics_id',
      )
      .leftJoinAndMapOne(
        'para.Assessment',
        Assessment,
        'a',
        'a.id = para.assessment_id',
      )
      .leftJoinAndMapOne('a.Prject', Project, 'p', 'p.id = a.climateAction_id')
      .innerJoinAndMapOne(
        'p.Country',
        Country,
        'cou',
        `p.countryId = cou.id and p.countryId = ${countryIdFromTocken}`,
      )
      // .innerJoinAndMapOne('p.Sector', Sector, 'sec', `p.sectorId = sec.id and p.sectorId = ${sectorIdFromTocken}`)
      .leftJoinAndMapOne(
        'para.institution',
        Institution,
        'i',
        'i.id = para.institution_id',
      )
      .where(whereCond)
      .orderBy('dr.createdOn', 'DESC')
      .groupBy('dr.id');
    let result = await paginate(data, options);
    if (result) {
      return result;
    }
  }

  async getNewDataRequestForClimateList(
    options: IPaginationOptions,
    filterText: string,
    climateActionId: number,
    year: string,
    dataProvider: number,
    countryIdFromTocken: number,
    sectorIdFromTocken: number,
  ): Promise<Pagination<any>> {
    let whereCond = (
      (climateActionId != 0
        ? `p.id=${climateActionId} AND  p.countryId = ${countryIdFromTocken} AND `
        : '') +
      (year != '' ? `ay.assessmentYear='${year}' AND ` : '') +
      (dataProvider != 0 ? `para.institution_id=${dataProvider} AND ` : '') +
      // '((para.isEnabledAlternative = true AND para.isAlternative = true) OR (para.isEnabledAlternative = false AND para.isAlternative = false) ) AND ' +
      `dr.dataRequestStatus in (-1,1,30,-6) AND ` +
      (filterText != ''
        ? `(p.climateActionName LIKE '%${filterText}%' OR para.name LIKE '%${filterText}%' OR i.name LIKE '%${filterText}%'
           )`
        : '')
    ).replace(/AND $/, '');

    console.log(whereCond);
    console.log("{==========================}");
    let data = this.repo
      .createQueryBuilder('dr')
      .select(['dr.id', 'para.id ', 'a.id as aid', 'p.id as pid'])
      .leftJoinAndMapOne(
        'dr.parameter',
        Parameter,
        'para',
        'para.id = dr.parameterId',
      )
      .leftJoinAndMapOne(
        'para.Assessment',
        Assessment,
        'a',
        'a.id = para.assessment_id',
      )
      .leftJoinAndMapOne('a.Prject', Project, 'p', 'p.id = a.climateAction_id')
      .innerJoinAndMapOne(
        'p.Country',
        Country,
        'cou',
        `p.countryId = cou.id and p.countryId = ${countryIdFromTocken}`,
      )
      .leftJoinAndMapOne(
        'para.institution',
        Institution,
        'i',
        'i.id = para.institution_id',
      )
      .where(whereCond)
      .orderBy('dr.createdOn', 'DESC')
      .groupBy('dr.id');
    console.log(options);
    let result = await paginate(data, options);

    if (result) {
      console.log('resulthhhhh====', result);
      return result;
    }
  }

  async getDateRequest(
    options: IPaginationOptions,
    filterText: string,
  ): Promise<Pagination<any>> {
    let filter: string = '';
    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        '(dr.climateActionName LIKE :filterText  OR dr.institution LIKE :filterText OR pas.name LIKE :filterText OR pst.name LIKE :filterText OR dr.contactPersoFullName LIKE :filterText  OR dr.editedOn LIKE :filterText OR dr.createdOn LIKE :filterText OR dr.acceptedDate LIKE :filterText)';
    }

    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapMany(
        'dr.parameter',
        Parameter,
        'para',
        'para.id = dr.parameterId',
      )
      .leftJoinAndMapMany(
        'para.Assessment',
        Assessment,
        'a',
        'a.id = para.assessment_id',
      )
      .leftJoinAndMapMany('a.Prject', Project, 'p', 'p.id = a.climateAction_id')
      //   .innerJoinAndMapOne('dr.user', User, 'u', 'dr.userId = u.id')
      .select([
        'p.climateActionName as climateAction',
        'para.AssessmentYear as year',
        'a.assessmentType as assessmentType',
        'dr.dataRequestStatus as dataRequestStatus',
        'dr.id as id',
      ])
      .where(filter, {
        filterText: `%${filterText}%`,
      })
      .orderBy('dr.createdOn', 'DESC');
    let result = await data.execute();
    //   console.log('result2', result2);
    if (result) {
      return result;
    }
  }

  async getAssignDataRequest(
    options: IPaginationOptions,
    filterText: string,
    climateActionId: number,
    userName: string,
  ): Promise<Pagination<any>> {
    let userItem = await this.userService.findByUserName(userName);
    let institutionId = userItem.institution ? userItem.institution.id : 0;

    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.parameterId',
        Parameter,
        'para',
        'para.id = dr.parameterId',
      )
      .leftJoinAndMapOne(
        'para.characteristics',
        Characteristics,
        'cha',
        'cha.id = para.characteristics_id',
      )
      .leftJoinAndMapOne(
        'para.category',
        Category,
        'cat',
        'cat.id = para.category_id',
      )
      .leftJoinAndMapOne(
        'para.Institution',
        Institution,
        'i',
        'i.id = para.institution_id',
      )
      .leftJoinAndMapOne(
        'para.Assessment',
        Assessment,
        'a',
        'a.id = para.assessment_id',
      )
      .leftJoinAndMapOne('a.User', User, 'u', 'u.id = dr.UserDataEntry')
      .leftJoinAndMapOne('a.Prject', Project, 'p', 'p.id = a.climateAction_id')
      .where(
        (
          (institutionId != 0 ? `i.id=${institutionId} AND ` : '') +
          (climateActionId != 0 ? `p.id=${climateActionId} AND ` : '') +
          `dr.dataRequestStatus in (2,3,-9,-10) AND ` +
          (filterText != ''
            ? `(p.climateActionName LIKE '%${filterText}%' OR para.name LIKE '%${filterText}%' OR u.username LIKE '%${filterText}%'
           )`
            : '')
        ).replace(/AND $/, ''),
      )
      .orderBy('dr.createdOn', 'DESC')
      .groupBy('dr.id');

    let result = await paginate(data, options);
    if (result) {
      console.log('ffff',result)
      return result;
    }
  }

  async getEnterDataParameter(
    options: IPaginationOptions,
    filterText: string,
    climateActionId: number,
    year: string,
    userName: string,
  ): Promise<Pagination<any>> {
    console.log("++++++++++++++++",userName)
    let userItem = await this.userService.findByUserName(userName);
    // console.log("++++++++++++++++",userItem)
    let userId = userItem ? userItem.id : 0;
    let insId = userItem ? userItem.institution.id : 0;
    console.log(userId ,"++++++++++++++++",userItem.userType.name)
    if (userItem.userType.name != 'Institution Admin') {
      console.log(userId ,"++++++++++++++++",userItem.userType.name)
      let data = this.repo
        .createQueryBuilder('dr')
        .leftJoinAndMapOne(
          'dr.parameterId',
          Parameter,
          'para',
          'para.id = dr.parameterId',
        )
        .leftJoinAndMapOne(
          'para.Assessment',
          Assessment,
          'a',
          'a.id = para.assessment_id',
        )
        .leftJoinAndMapOne('a.Prject', Project, 'p', 'p.id = a.climateAction_id')
        .leftJoinAndMapOne('a.User', User, 'u', 'u.id = dr.UserDataEntry')
        .where(
          (
            (userId != 0 ? `u.id=${userId} AND ` : '') +
            (climateActionId != 0 ? `p.id=${climateActionId} AND ` : '') +
            `dr.dataRequestStatus in (4,5,-8) AND ` +
            (year != '' ? `ay.AssessmentYear ='${year}' AND ` : '') +
            (filterText != ''
              ? `(p.climateActionName LIKE '%${filterText}%' OR para.name LIKE '%${filterText}%')`
              : '')
          ).replace(/AND $/, ''),
        )
        .groupBy('dr.id')
        .orderBy('dr.deadline', 'DESC');

      let result = await paginate(data, options);

      if (result) {
        return result;
      }
    } else {
      let data = this.repo
        .createQueryBuilder('dr')
        .leftJoinAndMapOne(
          'dr.parameterId',
          Parameter,
          'para',
          'para.id = dr.parameterId',
        )
        .leftJoinAndMapOne(
          'para.Assessment',
          Assessment,
          'a',
          'a.id = para.assessment_id',
        )
        .leftJoinAndMapOne('a.Prject', Project, 'p', 'p.id = a.climateAction_id')
        .leftJoinAndMapOne('para.category',Category,'cat','cat.id = para.category_id',)
        .leftJoinAndMapOne('para.characteristics',Characteristics,'chara','chara.id = para.characteristics_id',)
        .leftJoinAndMapOne(
          'para.Institution',
          Institution,
          'ins',
          'para.institution_id = ins.id',
        )
        .where(
          (
            (insId != 0 ? `para.institution_id=${insId} AND ` : '') +
            (climateActionId != 0 ? `p.id=${climateActionId} AND ` : '') +
            `dr.dataRequestStatus in (4,5,-8) AND ` +
            (year != '' ? `ay.AssessmentYear ='${year}' AND ` : '') +
            (filterText != ''
              ? `(p.climateActionName LIKE '%${filterText}%' OR para.name LIKE '%${filterText}%')`
              : '')
          ).replace(/AND $/, ''),
        )
        .orderBy('dr.deadline', 'DESC');

      let result = await paginate(data, options);
console.log("=========11",result)
      if (result) {
        return result;
      }
    }
  } 

  async getEnterDataParameters(options: IPaginationOptions,
    filterText: string,
    climateActionId: number,
    year: string,
    userName: string,
    tool: Tool
  ): Promise<Pagination<any>>{
    let data
    let userItem = await this.userService.findByUserName(userName);
    let userId = userItem ? userItem.id : 0;
    let insId = userItem ? userItem.institution.id : 0;
    climateActionId = Number(climateActionId)

    let filter
    if (filterText){
      if (filter) {
        filter = filter + 'project.climateActionName LIKE %:filterText% '
      } else {
        filter = 'project.climateActionName LIKE %:filterText% '
      }
    } 

    if (climateActionId !== 0){
      if (filter){
        filter = filter + 'AND climateAction.id = :climateActionId ';
      } else {
        filter = 'climateAction.id = :climateActionId '
      }
    } 
    if (insId){
      if (filter){
        filter = filter + 'AND assessmentAnswer.institutionId = :insId '
      } else {
        filter = 'assessmentAnswer.institutionId = :insId '
      }
    } 
    if (filter){
      filter = filter + 'AND request.dataRequestStatus in (4,5,-8) '
    } else {
      filter = 'request.dataRequestStatus in (4,5,-8) '
    }

    if (tool === Tool.CM_tool) {
      data = this.repo.createQueryBuilder('request')
      .leftJoinAndSelect(
        'request.cmAssessmentAnswer',
        'assessmentAnswer',
        'request.cmAssessmentAnswerId = assessmentAnswer.id'
      ).leftJoinAndSelect(
        'assessmentAnswer.assessment_question',
        'assessmentQuestion',
        'assessmentAnswer.assessmentQuestionId = assessmentQuestion.id'
      ).leftJoinAndSelect(
        'assessmentAnswer.answer',
        'answer',
        'assessmentAnswer.answerId = answer.id'
      ).leftJoinAndSelect(
        'assessmentQuestion.question',
        'question',
        'question.id = assessmentQuestion.questionId'
      ).leftJoinAndSelect(
        'assessmentQuestion.assessment',
        'assessment',
        'assessment.id = assessmentQuestion.assessmentId'
      ).leftJoinAndSelect(
        'assessment.climateAction',
        'climateAction',
        'climateAction.id = assessment.climateAction_id'
      ).where(
        filter, {climateActionId: climateActionId, insId: insId, filterText: filterText}
      )
    } else if (tool === Tool.Investor_tool) {

    } else if (tool === Tool.Portfolio_tool) {

    }

    console.log(data.getQuery())

    return await paginate(data, options)
  }

  async getReviewDataRequest(
    options: IPaginationOptions,
    filterText: string,
    climateActionId: number,
    year: string,
    type: string,
    userName: string,
  ): Promise<Pagination<any>> {
    console.log('userName', userName);
    let userItem = await this.userService.findByUserName(userName);
    let institutionId = userItem.institution ? userItem.institution.id : 0;

    let data = this.repo
      .createQueryBuilder('dr')
      .leftJoinAndMapOne(
        'dr.parameter',
        Parameter,
        'para',
        'para.id = dr.parameterId',
      )
      .leftJoinAndMapOne('para.category',Category,'cat','cat.id = para.category_id',)
        .leftJoinAndMapOne('para.characteristics',Characteristics,'chara','chara.id = para.characteristics_id',)
      .leftJoinAndMapOne(
        'para.Assessment',
        Assessment,
        'a',
        'a.id = para.assessment_id',
      )
      .leftJoinAndMapOne(
        'para.Institution',
        Institution,
        'i',
        'i.id = para.institution_id',
      )
      .leftJoinAndMapOne('a.User', User, 'u', 'u.id = dr.UserDataEntry')
      .leftJoinAndMapOne('a.Prject', Project, 'p', 'p.id = a.climateAction_id')
      .where(
        (
          (institutionId != 0 ? `i.id=${institutionId} AND ` : '') +
          (climateActionId != 0 ? `p.id=${climateActionId} AND ` : '') +
          `dr.dataRequestStatus in (6,7,-6) AND ` +
          (type != '' ? `a.assessmentType='${type}' AND ` : '') +
          (year != '' ? `ay.assessmentYear='${year}' AND ` : '') +
          (filterText != ''
            ? `(p.climateActionName LIKE '%${filterText}%' OR para.name LIKE '%${filterText}%' OR u.username LIKE '%${filterText}%' OR a.assessmentType  LIKE '%${filterText}%'
           )`
            : '')
        ).replace(/AND $/, ''),
      )
      .groupBy('dr.id');

    let result = await paginate(data, options);
    if (result) {
      return result;
    }
  }

  async updateDeadlineForIds(
    updateDataRequestDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    //let dataRequestItemList = new Array<ParameterRequest>();
    console.log('updateDataRequestDto', updateDataRequestDto);

    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      let dataRequestItem = await this.repo.findOne({ where: { id: id } });

      let ss = await this.paramterRepo.findByIds([
        dataRequestItem.parameter.id,
      ]);
      if (ss[0].institution != null) {
        console.log('sssssss', ss);
        var template =
          'Dear ' +
          ss[0].institution.name +
          '<br/>Data request with following information has shared with you.' +
        //   ' <br/> parameter name' +
        //   ss[0].name +
          '<br/> deadline ' +
          updateDataRequestDto.deadline;

        this.emaiService.sendMail(
          ss[0].institution.email,
          'Assign Deadline request',
          '',
          template,
        );
      }

      let originalStatus = dataRequestItem.dataRequestStatus;
      dataRequestItem.deadline = updateDataRequestDto.deadline;
      dataRequestItem.dataRequestStatus = updateDataRequestDto.status;
      //dataRequestItemList.push(dataRequestItem);
      this.repo.save(dataRequestItem).then((res) => {
        // console.log('res', res);
        console.log('res id....', res.id);
        this.parameterHistoryService.SaveParameterHistory(
          res.id,
          ParameterHistoryAction.DataRequest,
          'DataRequest',
          '',
          res.dataRequestStatus.toString(),
          originalStatus.toString(),
        );
      });
    }

    return true;
  }

  async updateDataEntryDeadlineForIds(
    updateDataRequestDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    //let dataRequestItemList = new Array<ParameterRequest>();

    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      let dataRequestItem = await this.repo.findOne({ where: { id: id } });
      console.log('updateDataRequestDto', updateDataRequestDto);
      let user = await this.userRepo.findByIds([updateDataRequestDto.userId]);

      let originalStatus = dataRequestItem.dataRequestStatus;
      dataRequestItem.deadlineDataEntry = updateDataRequestDto.deadline;
      dataRequestItem.UserDataEntry = updateDataRequestDto.userId;
      dataRequestItem.dataRequestStatus = updateDataRequestDto.status;

      var template =
        'Dear ' +
        user[0].fullName +
        ' ' +
        user[0].lastName +
        ' <br/> Data request with following information has shared with you.' +
        // '<br/> Parameter name' +
        // dataRequestItem.parameter.name +
        '<br/> deadline ' +
        updateDataRequestDto.deadline +
        '<br> comment' +
        updateDataRequestDto.comment;

      this.emaiService.sendMail(
        user[0].email,
        'Assign New Data Entry',
        '',
        template,
      );
      // dataRequestItemList.push(dataRequestItem);
      this.repo.save(dataRequestItem).then((res) => {
        console.log('res', res);
        this.parameterHistoryService.SaveParameterHistory(
          res.id,
          ParameterHistoryAction.AssignDataRequest,
          'AssignDataRequest',
          '',
          res.dataRequestStatus.toString(),
          originalStatus.toString(),
        );
      });
    }

    //this.repo.save(dataRequestItemList);

    return true;
  }

  async acceptReviewDataForIds(
    updateDataRequestDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    // let dataRequestItemList = new Array<ParameterRequest>();
    let tool = updateDataRequestDto.tool

    let insSec: any;
    let inscon: any;

    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];

      let para = this.repo.createQueryBuilder('dr')

      if (tool === Tool.CM_tool){
        para.leftJoinAndMapOne(
          'dr.cmAssessmentAnswer',
          CMAssessmentAnswer,
          'para',
          'dr.cmAssessmentAnswerId = para.id'
        )
      } else if (tool === Tool.Investor_tool){

      } else if (tool === Tool.Portfolio_tool){

      } else {
        para.leftJoinAndMapOne(
          'dr.parameter',
          Parameter,
          'para',
          'dr.ParameterId = para.id',
        )
      }
      
      para.leftJoinAndMapOne(
        'para.institution',
        Institution,
        'ins'
      )
      .leftJoinAndMapOne(
        'ins.country',
        Country,
        'cou',
        'cou.id = ins.countryId',
      ).where('dr.id = ' +id);

      let pararesult = await para.getMany();
    
      let originalStatus = pararesult
        ? pararesult[0].dataRequestStatus
        : 0;
        pararesult[0].dataRequestStatus = updateDataRequestDto.status;
      if (
        pararesult[0].dataRequestStatus &&
        pararesult[0].dataRequestStatus == DataRequestStatus.Data_Approved
      ) {
        pararesult[0].qaStatus = null;
      }

      console.log("tool", tool)
      if (tool === Tool.CM_tool) inscon = pararesult[0].cmAssessmentAnswer.institution.country;
      else if (tool === Tool.Investor_tool) inscon = '';
      else if (tool === Tool.Portfolio_tool) inscon = '';
      else inscon = pararesult[0].parameter.institution.country

      // inscon = tool === Tool.CM_tool ?  :
      //   (tool === Tool.Investor_tool ? '' :
      //     (tool === Tool.Portfolio_tool ? '' : pararesult[0].parameter.institution.country));
      insSec = tool === Tool.CM_tool ? pararesult[0].cmAssessmentAnswer.institution.sector :
        (tool === Tool.Investor_tool ? '' :
          (tool === Tool.Portfolio_tool ? '' : pararesult[0].parameter.institution.sector)) ; 

      this.repo.save(pararesult[0]).then((res) => {
        // this.parameterHistoryService.SaveParameterHistory(
        //   res.id,
        //   ParameterHistoryAction.EnterData,
        //   'EnterData',
        //   '',
        //   res.dataRequestStatus.toString(),
        //   originalStatus.toString(),
        // );
      });

      let filter: string = '';
      filter = `dr.id = :id`;
      let data = this.repo
        .createQueryBuilder('dr')

      if (tool === Tool.CM_tool){
        data.leftJoinAndMapOne(
          'dr.cmAssessmentAnswer',
          CMAssessmentAnswer,
          'pm',
          'dr.cmAssessmentAnswerId = pm.id'
        )
      } else if (tool === Tool.Portfolio_tool){

      } else if (tool === Tool.Investor_tool){

      } else {
        data.leftJoinAndMapOne(
          'dr.parameter',
          Parameter,
          'pm',
          'dr.ParameterId= pm.id',
        )

      }
        data.where(filter, { id });
      let result = await data.getOne();
      // console.log("data...",result)

      const paraId = tool === Tool.CM_tool ? result.cmAssessmentAnswer.id:
      (tool === Tool.Investor_tool ? '' :
        (tool === Tool.Portfolio_tool ? '' : result.parameter.id)) ;
      console.log('paraid', paraId);
    //   let parameterItem = await this.paramterRepo.findOne({
    //     where: { id: paraId },
    //   });
    //   if (parameterItem.isDefault == true) {
    //     let defaultVal = parameterItem.value;
    //     // console.log("defaultVal",defaultVal)
    //     // let defaultValId = parameterItem.defaultValue.id;

    //     let filter: string = '';
    //     filter = `pr.id = :paraId`;
    //     let data2 = this.defaultValRepo
    //       .createQueryBuilder('df')
    //       .leftJoinAndMapOne(
    //         'df.parameter',
    //         Parameter,
    //         'pr',
    //         'df.id = pr.defaultValueId',
    //       )
    //       .where(filter, { paraId });
    //     let result2 = await data2.getOne();
    //     //  console.log("result2",result2)

    //     let defaultValId = result2.id;
    //     // console.log("defaultValId",defaultValId)
    //     let defaultValObject = await this.defaultValRepo.findOne({
    //       where: { id: defaultValId },
    //     });
    //     defaultValObject.value = defaultVal;
    //     let savedObject = await this.defaultValRepo.save(defaultValObject);
    //     // console.log("defaultValObject...",defaultValObject)
    //   }
    }
    let user:User[];
    let ins = await this.institutionRepo.findOne({
        where: { country: inscon, sector: insSec },
    //   where: { country: inscon, sector: insSec, type: 2 },
    });
    user= await this.userRepo.find({where:{country:inscon}})
    // user= await this.userRepo.find({where:{country:inscon,userType:6,institution:ins}})
    user.forEach((ab)=>{
      console.log('=========', ins);
      var template: any;
      if (updateDataRequestDto.comment != undefined) { 
        template =
          'Dear ' +
          ab.username +
          ' ' +
          '<br/>Data request with following information has shared with you.' +
          ' <br/> Accepted reviw value' +
          // '<br/> parameter name -: ' + dataRequestItem.parameter.name +
          // '<br/> value -:' + dataRequestItem.parameter.value +
          '<br> comment -: ' +
          updateDataRequestDto.comment;
      } else {
        template =
          'Dear ' +
          ab.username +
          ' ' +
          '<br/>Data request with following information has shared with you.' +
          ' <br/> Accepted reviw value ';
        // '<br/> parameter name -: ' + dataRequestItem.parameter.name +
        // '<br/> value -:' + dataRequestItem.parameter.value;
      }
  
      this.emaiService.sendMail(ab.email, 'Accepted parameter', '', template);
    })
    
    // this.repo.save(dataRequestItemList);

    return true;
  }

  async rejectEnterDataForIds(
    updateDataRequestDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    // let dataRequestItemList = new Array<ParameterRequest>();

    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      let dataRequestItem = await this.repo.findOne({ where: { id: id } });
      let originalStatus = dataRequestItem.dataRequestStatus;
      dataRequestItem.noteDataRequest = updateDataRequestDto.comment;
      dataRequestItem.dataRequestStatus = updateDataRequestDto.status;
      dataRequestItem.UserDataEntry = updateDataRequestDto.userId;

      let email = dataRequestItem.parameter.institution.email;
      var template: any;
      if (updateDataRequestDto.comment != undefined) {
        template =
          'Dear ' +
          dataRequestItem.parameter.institution.name +
          ' ' +
          '<br/>Data request with following information has shared with you.' +
          ' <br/> Reject enterd value' +
        //   '<br/> parameter name -: ' +
        //   dataRequestItem.parameter.name +
          '<br> comment -: ' +
          updateDataRequestDto.comment;
      } else {
        template =
          'Dear ' +
          dataRequestItem.parameter.institution.name +
          ' ' +
          '<br/>Data request with following information has shared with you.' +
          ' <br/> Reject enterd value'
        //    +
        //   '<br/> parameter name -: ' +
        //   dataRequestItem.parameter.name;
      }

      this.emaiService.sendMail(email, 'Reject enterd value', '', template);

      this.repo.save(dataRequestItem).then((res) => {
        console.log('res', res);
        this.parameterHistoryService.SaveParameterHistory(
          res.id,
          ParameterHistoryAction.EnterData,
          'EnterData',
          res.noteDataRequest,
          res.dataRequestStatus.toString(),
          originalStatus.toString(),
        );
      });
      //  dataRequestItemList.push(dataRequestItem);
    }

    //this.repo.save(dataRequestItemList);

    return true;
  }

  async rejectReviewDataForIds(
    updateDataRequestDto: UpdateDeadlineDto,
  ): Promise<boolean> {
    // let dataRequestItemList = new Array<ParameterRequest>();

    for (let index = 0; index < updateDataRequestDto.ids.length; index++) {
      const id = updateDataRequestDto.ids[index];
      let dataRequestItem = await this.repo.findOne({ where: { id: id } });
      let originalStatus = dataRequestItem.dataRequestStatus;

      let user = await this.userRepo.findByIds([updateDataRequestDto.userId]);
      let template: any;

      if (updateDataRequestDto.status === -9) {
        let ins = dataRequestItem.parameter;
        template =
          'Dear ' +
          ins.institution.name +
          ' ' +
          '<br/>Data request with following information has shared with you.' +
          ' <br/> We are assign  Data entry' +
          '<br/> deadline ' +
          updateDataRequestDto.deadline +
          '<br> comment' +
          updateDataRequestDto.comment;
        this.emaiService.sendMail(
          ins.institution.email,
          'Assign  Data Entry',
          '',
          template,
        );
      } else {
        if (updateDataRequestDto.comment != undefined) {
          template =
            'Dear ' +
            user[0].fullName +
            ' ' +
            user[0].lastName +
            '<br/>Data request with following information has shared with you.' +
            ' <br/> We are assign  Data entry' +
            '<br/> deadline ' +
            updateDataRequestDto.deadline +
            '<br> comment' +
            updateDataRequestDto.comment;
          this.emaiService.sendMail(
            user[0].email,
            'Assign  Data Entry',
            '',
            template,
          );
        } else {
          template =
            'Dear ' +
            user[0].fullName +
            ' ' +
            user[0].lastName +
            '<br/>Data request with following information has shared with you.' +
            ' <br/> We are assign new Data entry' +
            '<br/> deadline ' +
            updateDataRequestDto.deadline;

          this.emaiService.sendMail(
            user[0].email,
            'Assign  Data Entry',
            '',
            template,
          );
        }
      }

      dataRequestItem.noteDataRequest = updateDataRequestDto.comment;
      dataRequestItem.dataRequestStatus = updateDataRequestDto.status;
      dataRequestItem.UserDataEntry = updateDataRequestDto.userId;
      this.repo.save(dataRequestItem).then((res) => {
        console.log('res', res);
        this.parameterHistoryService.SaveParameterHistory(
          res.id,
          ParameterHistoryAction.ReviewData,
          'ReviewData',
          res.noteDataRequest,
          res.dataRequestStatus.toString(),
          originalStatus.toString(),
        );
      });
      //  dataRequestItemList.push(dataRequestItem);
    }

    return true;
  }

  async getClimateActionByDataRequestStatus(): Promise<any> {
    let data = this.ProjectRepo.createQueryBuilder('pr')
      .leftJoinAndMapMany(
        'pr.Assessment',
        Assessment,
        'ass',
        'pr.id = ass.climateAction_id',
      )
      .leftJoinAndMapMany(
        'ass.Parameter',
        Parameter,
        'para',
        'ass.id = para.assessment_id',
      )
      .leftJoinAndMapOne(
        'para.DataRequest',
        ParameterRequest,
        'paraReq',
        'para.id = paraReq.ParameterId', //and paraReq.dataRequestStatus = 2
      )
      .where('paraReq.dataRequestStatus = ' + 2);

    let result = await data.getMany();
    return result;
  }

  async getClimateActionByDataRequestStatusSix(): Promise<any> {
    let data = this.ProjectRepo.createQueryBuilder('pr')
      .leftJoinAndMapMany(
        'pr.Assessment',
        Assessment,
        'ass',
        'pr.id = ass.climateAction_id',
      )
      .leftJoinAndMapMany(
        'ass.Parameter',
        Parameter,
        'para',
        'ass.id = para.assessment_id',
      )
      .leftJoinAndMapOne(
        'para.DataRequest',
        ParameterRequest,
        'paraReq',
        'para.id = paraReq.ParameterId', //and paraReq.dataRequestStatus = 2
      )
      .where('paraReq.dataRequestStatus = ' + 6);

    let result = await data.getMany();

    return result;
  }
}
